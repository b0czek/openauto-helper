import { Gpio } from "onoff";

import { RendererIO } from "./io";
import IOComponent, { IOAuxComponentConfig } from "./ioComponent";
import LightSensor from "./lightsensor";

export interface DayNightConfig extends IOAuxComponentConfig {
    outputGpio: number;
    threshold: number;
    deadZone: number;
}

export enum DayNightState {
    Day = "day",
    Night = "night",
}

export default class DayNight extends IOComponent {
    private lightSensor: LightSensor;
    private config: DayNightConfig;
    private outputGpio: Gpio;

    public lastKnownValue: number | null;
    public state: DayNightState = DayNightState.Day;
    constructor(config: DayNightConfig, ios: RendererIO, ...aux: LightSensor[]) {
        super(config, ios);
        this.config = config;
        let component = aux.find((component) => component.type == "lightsensor");
        if (!component) {
            throw new Error("LightSensor component was not provided to DayNight component");
        }
        this.lightSensor = component;

        // initial values
        this.lastKnownValue = this.lightSensor.value;
        if (this.lastKnownValue !== null) {
            this.state = this.lastKnownValue >= this.config.threshold ? DayNightState.Day : DayNightState.Night;
        }
        this.outputGpio = new Gpio(this.config.outputGpio, "out");
        this._updateGpio();

        //watch for light sensor events
        this.lightSensor.watchForChanges(this._calculateNewState);
        // set a listener on ipc
        this.ios.ipcMain.on(this.name, () => {
            this.sendState(null, this.state);
        });
    }
    private _updateGpio() {
        this.outputGpio.writeSync(this.state == DayNightState.Day ? 0 : 1);
    }

    private _calculateNewState = (err: any, value: number | null) => {
        this.lastKnownValue = value;

        if (err || value === null) {
            return;
        }

        if (
            (value > this.config.threshold + this.config.deadZone && this.state == DayNightState.Night) ||
            (value < this.config.threshold - this.config.deadZone && this.state == DayNightState.Day)
        ) {
            this.state = this.state == DayNightState.Day ? DayNightState.Night : DayNightState.Day;
            this._updateGpio();
            this.sendState(null, this.state);
        }
    };

    public close() {
        this.lightSensor.unwatch(this._calculateNewState);
        this.outputGpio.unexport();
    }
}
