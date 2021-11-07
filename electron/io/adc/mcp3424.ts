import { RendererIO } from "../io";
import IOComponent, { IOComponentConfig } from "../ioComponent";

import i2c from "i2c-bus";

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

export type Channels = ZeroToThree;
export type Gains = ZeroToThree;
export type Resolutions = ZeroToThree;

export type WatchCallback = (err: any) => void;
type ReadDataResult = number | null;

export interface MCP3424Config extends IOComponentConfig {
    address: number;
    resolution: Resolutions;
    gain: Gains;
    busNumber: number;
    readingInterval: number;
    changeInsensitivity: number;
}

interface ChannelData {
    lastValue: number;
    callbacks: (WatchCallback | null)[];
    value: number;
    channel: Channels;
}

export default class MCP3424 extends IOComponent {
    private currentChannel: ChannelData;
    private channelsData: (ChannelData | null)[] = new Array(4).fill(null);

    private config: MCP3424Config;
    private bus: i2c.I2CBus;

    private _interval: NodeJS.Timeout;

    constructor(config: MCP3424Config, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        this.bus = i2c.openSync(this.config.busNumber);
    }

    public openChannel(channel: Channels) {
        let newChannel: ChannelData = {
            callbacks: [],
            lastValue: 0,
            value: 0,
            channel,
        };
        this.channelsData[channel] = newChannel;
        // if the opened channel is the only one, start reading data from adc
        if (this._getOpenedChannels().length == 1) {
            this.currentChannel = newChannel;
            this._readDataContinuously();
        }
    }
    public closeChannel(channel: Channels) {
        this.channelsData[channel] = null;
        if (this._getOpenedChannels().length == 0) {
            clearInterval(this._interval);
            // current channel does not need to be nulled since its only used while reading
            // which is actually stopped
        }
    }
    public close() {
        clearInterval(this._interval);
        this.bus.closeSync();
    }
    public watch(channel: Channels, callback: WatchCallback): void {
        let chan = this.channelsData[channel];
        if (chan !== null) {
            chan.callbacks.push(callback);
        } else {
            throw new Error("Cannot watch not opened channel. Try opening it first.");
        }
    }
    public unwatch(channel: Channels, callback: WatchCallback): void {
        let chan = this.channelsData[channel];
        if (chan !== null && chan.callbacks.length > 0) {
            this.channelsData[channel]!.callbacks = chan.callbacks.filter((cb) => cb !== callback);
        } else {
            throw new Error("Cannot unwatch not opened channel or there are no callbacks for this channel.");
        }
    }

    public getVoltage(channel: Channels): number | null {
        let mv = this.getMv(channel);
        if (mv) {
            return mv * (0.0005 / this._getPga()) * 2.471;
        }
        return null;
    }
    public getMv(channel: Channels): number | null {
        return this.channelsData[channel] ? this.channelsData[channel]!.value : null;
    }

    private _getMvDivisor(): number {
        return 1 << (this.config.gain + 2 * this.config.resolution);
    }
    private _getPga() {
        switch (this.config.gain) {
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
        return (command |= (channel << 5) | (this.config.resolution << 2) | this.config.gain);
    }
    private _getCommandBuffer = (command: number) => Buffer.from([command]);

    private _changeChannel(channel: Channels): void {
        let command = this._getAdcCommand(channel);
        let buffer = this._getCommandBuffer(command);
        this.bus.i2cWriteSync(this.config.address, buffer.length, buffer);
    }

    private _nextChannel(): ChannelData | null {
        let currentChannel = this.currentChannel.channel;

        for (let i = currentChannel + 1; i <= 4 + currentChannel; i++) {
            let idx = i % 4;
            if (this.channelsData[idx] !== null) {
                return this.channelsData[idx];
            }
        }
        return null;
    }

    private _getOpenedChannels = (): Channels[] => this.channelsData.filter((c) => c !== null).map((c) => c!.channel);

    private _emitDataChange(chan: ChannelData, err: any): void {
        for (let callback of chan.callbacks) {
            if (typeof callback === "function") {
                callback(err);
            }
        }
    }
    // basically start interval
    // this should be a timeout, so the data would be read before first interval finishing
    // but it would make this function asynchronous and i dont care that much
    private _readDataContinuously(): void {
        this._interval = setInterval(async (_) => {
            let chan: ChannelData = this.currentChannel;
            let newValue: ReadDataResult = null;
            try {
                newValue = await this._readData(chan.channel);
            } catch (err) {
                this._emitDataChange(chan, err);
            }
            // check if value was actually read
            if (newValue === null) {
                return;
            }

            if (
                chan.lastValue + this.config.changeInsensitivity < newValue ||
                chan.lastValue - this.config.changeInsensitivity > newValue
            ) {
                //if value changed
                chan.lastValue = newValue; // update last value
                this._emitDataChange(chan, null);
            }
        }, this.config.readingInterval);
    }

    private async _readData(channel: Channels): Promise<ReadDataResult> {
        return new Promise(async (resolve, reject) => {
            let command: number = this._getAdcCommand(channel);

            let bw: Buffer = this._getCommandBuffer(command);
            let br: Buffer = Buffer.alloc(4); // read 4 bytes

            let bus: i2c.PromisifiedBus = this.bus.promisifiedBus();
            try {
                await bus.i2cWrite(this.config.address, bw.length, bw);
                await bus.i2cRead(this.config.address, br.length, br);
            } catch (err) {
                return reject(err);
            }
            // mask the config  and if the resolution is 18 bit, then there are 3 bytes for data
            let dataBytes = (command & MCP342X_RES_FIELD) === MCP342X_18_BIT ? 3 : 2;

            // convert read bytes
            let result: number = br.readUIntBE(0, dataBytes);
            let statusByte = br[dataBytes];

            if ((statusByte & MCP342X_BUSY) === 0) {
                // calculate mV present on the adc channel
                this.currentChannel.value = result / this._getMvDivisor();
                // get next channel number
                let nextChannel = this._nextChannel();
                if (nextChannel === null) {
                    return resolve(null);
                }
                try {
                    // try to change to it
                    this._changeChannel(nextChannel.channel);
                } catch (err) {
                    // if it fails, then notify about it
                    return reject(err);
                }
                // if channel changes sucessfully, then switch variable to next channel
                this.currentChannel = nextChannel;

                return resolve(result);
            } else {
                // bus is busy
                return resolve(null);
            }
        });
    }
}
