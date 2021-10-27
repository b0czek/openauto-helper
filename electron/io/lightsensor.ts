import IOComponent, { IOComponentConfig } from "./ioComponent";
import { RendererIO } from "./io";
import Tsl2561, { Gains, IntegrationTimes } from "ada-tsl2561-ts";

export interface LightSensorConfig extends IOComponentConfig {
    busNumber: number;
    address: number;
    readingInterval: number;
    changeInsensitivity: number;
    gain?: Gains;
    intergrationTime?: IntegrationTimes;
}
type Callback = (err: any, value: number | null) => void;
interface CallbackData {
    callback: Callback;
    type: "any" | "change";
}

export default class LightSensor extends IOComponent {
    private config: LightSensorConfig;
    private sensor: Tsl2561;
    private interval: NodeJS.Timeout;
    public value: number | null = null;

    constructor(config: LightSensorConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        this.sensor = new Tsl2561();
        this._readSensor = this._readSensor.bind(this);
        this._initSensor().catch((err) => {
            this.error(`${this.config.name} could not be initialized ${err.toString()}`);
        });

        this.ios.ipcMain.on(this.name, () => {
            this.sendState(null, this.value ?? 0);
        });
    }

    private callbacks: CallbackData[] = [];
    // watch for readings outside change insensitivity
    public watchForChanges(cb: Callback) {
        this.callbacks.push({
            callback: cb,
            type: "change"
        });
    }
    // watch for any reading
    public watch(cb:Callback) {
        this.callbacks.push({
            callback:cb,
            type: "any"
        });
    }

    public unwatch(callback: Callback) {
        this.callbacks = this.callbacks.filter(data => data.callback !== callback);
    }

    private _emitChange(err: any, data: number | null) {
        this.sendState(err, data);
        this.value = data;

        this.callbacks.forEach(d => d.callback(err, data));
    }

    private async _initSensor(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sensor.init(this.config.busNumber, this.config.address);
                await this.sensor.enable();

                await this._readSensor();
                this.interval = setInterval(this._readSensor, this.config.readingInterval);
            } catch (err) {
                reject(err);
            }

            resolve();
        });
    }
    private _readSensor = async () => {
        let reading: number;
        try {
            reading = await this.sensor.getLux();
            if (isNaN(reading) || reading === null) {
                // if the reading is invalid, act like it never happened
                return;
            }
            reading = Math.round(reading);
            // if there was an error last time reading sensor
            if (this.value === null || isOutsideRange(this.value, reading, this.config.changeInsensitivity)) {
                this._emitChange(null, reading);
            }
            else {
                this.callbacks.filter((d) => d.type === "any").forEach((d) => d.callback(null, reading));
            }
        } catch (err) {
            this.log(`error reading sensor ${err.toString()}`);
            this._emitChange(err, null);
        }
    };

    public close() {
        clearInterval(this.interval);
        this.sensor.free();
    }
}

const isOutsideRange = (oldValue: number, newValue: number, range: number) =>
    oldValue + range < newValue || oldValue - range > newValue;
