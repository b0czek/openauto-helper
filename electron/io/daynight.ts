import { Gpio } from "onoff";

import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import LightSensor from "./lightsensor";

export interface DayNightConfig extends IOComponentConfig {
    // gpio to be used for interfacing with openauto
    outputGpio: number;
    // threshold conditioning switching between day and night
    threshold: number;
    // when current value drops below criticalThreshold,
    // state is immidiately(or after x readings if criticalStreak specified) changed to night
    criticalThreshold: number;
    // how many times reading must be below criticalThreshold to change state to night
    // if not specified, state is changed after 1 reading
    // used for delaying sensor reaction time
    criticalStreak?: number;
    // how many error can happen in a row before immidiate change of state (similiar to criticalThreshold)
    maxErrorStreak: number;
    // size of samples which are used to calculate average light conditions
    sampleSize: number;
    // time waited to switch state after exceeding threshold
    switchInterval: number;
    // number in range from 0.0 to 1.0 specifying % of threshold value needed additionally to overcome change threshold
    // i.e. if current state is night and threshold is 300 with deadzone of 0.1,
    // then value greater than 330 would be needed to switch state
    deadZone: number;
}
export enum DayNightState {
    Day = "day",
    Night = "night",
}
export default class DayNight extends IOComponent {
    private lightSensor: LightSensor;
    private outputGpio: Gpio;

    private config: DayNightConfig;
    private deadZone: number;

    private errorStreak: number = 0;
    private _criticalStreak: number = 0;

    private samples: SensorSamples;
    private switchTimeout: number | null = null;

    public state: DayNightState = DayNightState.Night;

    constructor(config: DayNightConfig, ios: RendererIO, ...aux: LightSensor[]) {
        super(config, ios);
        this.config = config;
        this.deadZone = config.deadZone * config.threshold;
        if (!this.config.criticalStreak) this.config.criticalStreak = 1;
        // get lightsensor component
        this.lightSensor = this.getAuxComponent({ type: "lightsensor" }, aux);

        this.samples = new SensorSamples(this.config.sampleSize);

        // initial values
        if (this.lightSensor.value !== null) {
            this.samples.push(this.lightSensor.value);
            this._calculateNewState();
        }
        // gpio setup
        try {
            this.outputGpio = new Gpio(this.config.outputGpio, "out");
            this._updateGpio();
        } catch {}
        //watch for light sensor events
        this.lightSensor.watch(this._onLightChange);
        // set a listener on ipc
        this.ios.ipcMain.on(this.name, () => {
            this.sendState(null, this.state);
        });
        this.setStateListener(() => {
            this.sendState(null, this.exportData(), "data");
        }, "data");
    }

    private _clearSwitchTimeout() {
        if (this.switchTimeout) {
            this.log("clearing switch timeout");
            clearTimeout(this.switchTimeout);
            this.switchTimeout = null;
        }
    }

    private _updateGpio() {
        this.outputGpio.writeSync(this.state == DayNightState.Day ? 0 : 1);
    }
    private _updateState = (state: DayNightState, recheckValue: boolean = true) => {
        this._clearSwitchTimeout();
        if (recheckValue) {
            let avg = this.samples.average;
            // check if avg is still eglible for switch (used for timeouts)
            if (
                (avg < this.config.threshold && state == DayNightState.Day) ||
                (avg > this.config.threshold && state == DayNightState.Night)
            ) {
                return;
            }
        }
        this.state = state;
        this._updateGpio();
        this.sendState(null, this.state);
    };

    private _emergencyStateChange = (state: DayNightState) => {
        this.warn(`Emergency state change to ${state}`);
        this._clearSwitchTimeout();
        this._updateState(state, false);
    };

    private _onLightChange = (err: any, value: number | null) => {
        if (err || value === null) {
            // increment the counter if there was an error
            this.errorStreak++;
            // and if there were enough errors in a row
            if (this.errorStreak >= this.config.maxErrorStreak) {
                // change state immidiately to night
                this._emergencyStateChange(DayNightState.Night);
            }
            return;
        }
        // reset the counter everytime there isn't an error
        this.errorStreak = 0;
        // add value to stack
        this.samples.push(value);
        // send new data to frontend
        this.sendState(null, this.exportData(), "data");

        // if light conditions are under critial, change state to night
        if (value <= this.config.criticalThreshold && this.state == DayNightState.Day) {
            this._criticalStreak++;
            // if criticalStreak is not specified, it's set to 1 in constructor so non-null checking is unnecessary
            if (this._criticalStreak >= this.config.criticalStreak!) {
                this._emergencyStateChange(DayNightState.Night);
            }
            return;
        }
        this._criticalStreak = 0;
        this._calculateNewState();
    };

    private _calculateNewState() {
        // get sample stack's average
        let avg = this.samples.average;
        // if value exceeds current state's range
        if (
            (avg > this.config.threshold + this.deadZone && this.state == DayNightState.Night) ||
            (avg < this.config.threshold - this.deadZone && this.state == DayNightState.Day)
        ) {
            // and if there isn't a timeout already scheduled
            if (!this.switchTimeout) {
                // schedule state update with opposite state
                let newState = this.state == DayNightState.Day ? DayNightState.Night : DayNightState.Day;
                this.log(`scheduling state change to ${newState}`);
                this.switchTimeout = setTimeout(this._updateState, this.config.switchInterval, newState);
            }
        }
        // if average is in range of current state and there is timeout scheduled, clear it
        else if (this.switchTimeout) {
            this._clearSwitchTimeout();
        }
    }

    public exportData = () => {
        return {
            state: this.state,
            errorStreak: this.errorStreak,
            criticalStreak: this._criticalStreak,
            samples: this.samples,
        };
    };

    public close() {
        this.lightSensor.unwatch(this._calculateNewState);
        this.outputGpio.unexport();
    }
}

class SensorSamples extends Array<number> {
    private arraySize: number;
    constructor(arraySize: number) {
        super();
        this.arraySize = arraySize;
    }

    public push(...items: number[]): number {
        let overflown: number = Math.max(this.length + items.length - this.arraySize, 0);
        if (overflown) {
            for (let i = 0; i < overflown; i++) {
                if (items.length > this.arraySize) {
                    items.shift();
                } else {
                    this.shift();
                }
            }
        }

        return super.push(...items);
    }
    public get average(): number {
        let sum = this.reduce((a, b) => a + b, 0);
        return sum / this.length || 0;
    }
}