import IOComponent from "./ioComponent";
import { IOs } from "./io";
import sensor from "ds18b20-raspi-typescript";

export interface DS18B20Config {
    name: string;
    sensorId: string;
    readingInterval: number;
    changeInsensitivity: number;
}

export default class DS18B20 extends IOComponent {
    private config: DS18B20Config;
    private interval: NodeJS.Timeout;
    private lastTemp: number | null = null;
    private temp: number | null;

    constructor(config: DS18B20Config, ios: IOs) {
        super(config.name, ios);
        this.config = config;
        this.temp = sensor.readC(this.config.sensorId, 1);
        this.interval = setInterval(() => {
            this._readTemp();
        }, this.config.readingInterval);

        this.ios.ipcMain.on(this.name, () => {
            this.sendState(null, this.temp);
        });
    }

    public close() {
        clearInterval(this.interval);
    }

    private _readTemp = (): void => {
        sensor.readC(this.config.sensorId, 1, (err, result) => {
            if (err) {
                this.sendState(err);
                console.error(err);
                return;
            }

            console.log((this.temp = result));
            if (
                this.temp !== null &&
                (this.lastTemp === null ||
                    this.lastTemp + this.config.changeInsensitivity < this.temp ||
                    this.lastTemp - this.config.changeInsensitivity > this.temp)
            ) {
                //if temperature changed or there was error previously
                this.sendState(null, this.temp);
                this.lastTemp = this.temp;
            }
        });
    };
}
