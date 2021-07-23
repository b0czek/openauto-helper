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

export default class LightSensor extends IOComponent {
    private config: LightSensorConfig;
    private sensor: Tsl2561;
    private value: number | null = 0;
    private interval: NodeJS.Timeout;

    constructor(config: LightSensorConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        this.sensor = new Tsl2561();
        this._readSensor = this._readSensor.bind(this);
        this._initSensor();

        this.ios.ipcMain.on(this.name, () => {
            this.sendState(null, this.value);
        });
    }
    private async _initSensor(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sensor.init(
                    this.config.busNumber,
                    this.config.address
                );
                await this.sensor.enable();

                await this._readSensor();
                this.interval = setInterval(
                    this._readSensor,
                    this.config.readingInterval
                );
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
            if (this.value === null) {
                this.value = reading;
            } else if (
                this.value + this.config.changeInsensitivity < reading ||
                this.value - this.config.changeInsensitivity > reading
            ) {
                this.value = reading;
                this.sendState(null, reading);
                console.log(reading);
            }
        } catch (err) {
            console.log(err);
            this.sendState(err);
            this.value = null;
        }
    };

    public close() {
        clearInterval(this.interval);
        this.sensor.free();
    }
}
