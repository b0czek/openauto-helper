import IOComponent, { IOComponentConfig } from "./ioComponent";
import { RendererIO } from "./io";
import Tsl2561 from "ada-tsl2561-ts";

export interface LightSensorConfig extends IOComponentConfig {
    busNumber: number;
    address: number;
    readingInterval: number;
    changeInsensitivity: number;
    radicalReassuranceReadings: number;
    radicalThreshold: number;
}

// 1/10th of total possible values
const radicalChangeThreshold = Math.round(Math.pow(2, 16) / 10);

export default class LightSensor extends IOComponent {
    private config: LightSensorConfig;
    private sensor: Tsl2561;
    private value: number | null = 0;
    private reassuranceReadings: number = 0;
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
                await this.sensor.setGain(0); //1x
                await this.sensor.setIntegrationTime(2); //402ms
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
            reading = await this.sensor.getBroadband();
            console.log(reading);
        } catch (err) {
            this.sendState(err);
            this.value = null;
            return;
        }
        reading = Math.round(reading);

        // if there was an error last time reading sensor
        if (this.value === null) {
            this.value = reading;
            return;
        }
        // if change is too drastic
        if (isOutsideRange(this.value, reading, radicalChangeThreshold)) {
            // and there wasnt enough reassurance reading
            if (
                this.reassuranceReadings !==
                this.config.radicalReassuranceReadings
            ) {
                // then add one and return
                this.reassuranceReadings++;
                return;
            }
        }
        // if the change wasnt drastic or
        // if there was enough reassurence readings, then reset its count
        this.reassuranceReadings = 0;

        // if the change is big enough to emit it
        if (
            isOutsideRange(this.value, reading, this.config.changeInsensitivity)
        ) {
            this.value = reading;
            this.sendState(null, reading);
            console.log(reading);
        }
    };

    public close() {
        clearInterval(this.interval);
        this.sensor.free();
    }
}
const isOutsideRange = (oldValue: number, newValue: number, range: number) =>
    oldValue + range < newValue || oldValue - range > newValue;
