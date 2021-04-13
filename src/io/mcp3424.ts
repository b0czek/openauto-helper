// mcp3424 npm library rewritten with typescript and with better i2c library

import i2c from "i2c-bus";
import { MCP3424Options } from "src/config";

let MCP342X_GAIN_FIELD = 0x03,
    MCP342X_GAIN_X1 = 0x00,
    MCP342X_GAIN_X2 = 0x01,
    MCP342X_GAIN_X4 = 0x02,
    MCP342X_GAIN_X8 = 0x03,
    MCP342X_RES_FIELD = 0x0c,
    MCP342X_RES_SHIFT = 2,
    MCP342X_12_BIT = 0x00,
    MCP342X_14_BIT = 0x04,
    MCP342X_16_BIT = 0x08,
    MCP342X_18_BIT = 0x0c,
    MCP342X_CONTINUOUS = 0x10,
    MCP342X_CHAN_FIELD = 0x60,
    MCP342X_CHANNEL_1 = 0x00,
    MCP342X_CHANNEL_2 = 0x20,
    MCP342X_CHANNEL_3 = 0x40,
    MCP342X_CHANNEL_4 = 0x60,
    MCP342X_START = 0x80,
    MCP342X_BUSY = 0x80;
type ZeroToThree = 0 | 1 | 2 | 3;
export type WatchCallback = (err: any) => void;
export type Channels = ZeroToThree;
export type Gains = ZeroToThree;
export type Resolutions = ZeroToThree;
type ReadDataResult = number | null;

class MCP3424 {
    private channel: number[] = [];
    private currentChannel: Channels = 0;

    private lastValues: number[] = [0, 0, 0, 0];
    private channelCallback: (WatchCallback | null)[] = [];

    private address: number;
    private gain: Gains;
    private res: Resolutions;
    private busNumber: number;
    private readingInterval: number;
    private changeInsensitivity: number;

    private bus: i2c.I2CBus;

    private _interval: NodeJS.Timeout;

    constructor(options: MCP3424Options) {
        this.address = options.address;
        this.gain = options.gain;
        this.res = options.resolution;
        this.busNumber = options.busNumber;
        this.readingInterval = options.readingInterval;
        this.changeInsensitivity = options.changeInsensitivity;

        this.bus = i2c.openSync(this.busNumber);
        this._readDataContinuously();
    }

    public close() {
        clearInterval(this._interval);
        this.bus.closeSync();
    }
    public watch(channel: Channels, callback: WatchCallback): void {
        this.channelCallback[channel] = callback;
    }
    public unwatch(channel: Channels): void {
        this.channelCallback[channel] = null;
    }

    public getVoltage(channel: Channels): number {
        return this.getMv(channel) * (0.0005 / this._getPga()) * 2.471;
    }

    public getMv(channel: Channels): number {
        return this.channel[channel];
    }
    private _getMvDivisor(): number {
        return 1 << (this.gain + 2 * this.res);
    }
    private _getPga() {
        switch (this.gain) {
            case MCP342X_GAIN_X1:
                return 0.5;
            case MCP342X_GAIN_X2:
                return 1;
            case MCP342X_GAIN_X4:
                return 2;
            case MCP342X_GAIN_X8:
                return 4;
        }
        return 0;
    }
    private _getAdcCommand(channel: Channels): number {
        let command = MCP342X_CHANNEL_1 | MCP342X_CONTINUOUS;
        return (command |= (channel << 5) | (this.res << 2) | this.gain);
    }
    private _getCommandBuffer = (command: number) => Buffer.from([command]);

    private _changeChannel(channel: Channels): void {
        let command = this._getAdcCommand(channel);
        let buffer = this._getCommandBuffer(command);
        this.bus.i2cWriteSync(this.address, buffer.length, buffer);
    }

    private _nextChannel(): void {
        // if channel is on 3, loop it back to 0
        if (this.currentChannel == 3) {
            this.currentChannel = 0;
        } else {
            this.currentChannel++;
        }
    }

    private _emitDataChange(chan: Channels, err: any): void {
        if (typeof this.channelCallback[chan] === "function") {
            this.channelCallback[chan]!(err);
        }
    }

    private _readDataContinuously(): void {
        this._interval = setInterval(async (_) => {
            let chan: Channels = this.currentChannel;
            let newValue: ReadDataResult = null;
            try {
                newValue = await this._readData(chan);
            } catch (err) {
                this._emitDataChange(chan, err);
            }
            // check if value was actually read
            if (newValue === null) {
                return;
            }

            if (
                this.lastValues[chan] + this.changeInsensitivity < newValue ||
                this.lastValues[chan] - this.changeInsensitivity > newValue
            ) {
                //if value changed
                this.lastValues[chan] = newValue; // update last value
                this._emitDataChange(chan, null);
            }
        }, this.readingInterval);
    }

    private async _readData(channel: Channels): Promise<ReadDataResult> {
        return new Promise(async (resolve, reject) => {
            let command: number = this._getAdcCommand(channel);

            let bw: Buffer = this._getCommandBuffer(command);
            let br: Buffer = Buffer.alloc(4); // read 4 bytes

            let bus: i2c.PromisifiedBus = this.bus.promisifiedBus();
            try {
                await bus.i2cWrite(this.address, bw.length, bw);
                await bus.i2cRead(this.address, br.length, br);
            } catch (err) {
                console.error(err);
                reject(err);
            }
            // mask the config  and if the resolution is 18 bit, then there are 3 bytes for data
            let dataBytes = (command & MCP342X_RES_FIELD) === MCP342X_18_BIT ? 3 : 2;

            // convert read bytes
            let result: number = br.readUIntBE(0, dataBytes);
            let statusByte = br[dataBytes];

            if ((statusByte & MCP342X_BUSY) === 0) {
                this.channel[this.currentChannel] = result / this._getMvDivisor();
                this._nextChannel();
                this._changeChannel(this.currentChannel);
                resolve(result);
            } else {
                resolve(null);
            }
        });
    }
}
export default MCP3424;
