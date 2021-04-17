import { Gpio, ValueCallback, BinaryValue } from "onoff";
import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import { IpcMainEvent } from "electron";

export interface OnOffConfig extends IOComponentConfig {
    gpioNumber: number;
    activeLow: boolean;
    feedbackGpioNumber?: number;
    scheduleTime?: number;
}

export default class OnOff extends IOComponent {
    private gpio: Gpio;
    private feedback: Gpio;
    private scheduleTimeout: NodeJS.Timeout | null = null;
    private config: OnOffConfig;
    constructor(config: OnOffConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;

        this.gpio = new Gpio(this.config.gpioNumber, "out", "none", {
            activeLow: this.config.activeLow,
        });
        // if pin has auxilliary pin for feedback provided
        if (config.feedbackGpioNumber) {
            this.feedback = new Gpio(config.feedbackGpioNumber, "in", "both");
            this.feedback.watch((err, value) => {
                console.log(err);
                console.log(value);
                this._readCallback(err, value);
            });
        }

        // initialize pin to offstate (actually not needed since creating a gpio object sets it to its offstate)
        // this.gpio.writeSync(0);

        //watch for requestes from frontend
        this.ios.ipcMain.on(this.name, (_: IpcMainEvent, message: any) => {
            // if the message is read, send the current gpio state back
            if (message === "read") {
                if (config.feedbackGpioNumber) {
                    this.feedback.read(this._readCallback);
                } else {
                    this.gpio.read(this._readCallback);
                }
            }
            // if the message is toggle, flip the state
            else if (message === "toggle") {
                // if it is not scheduled
                if (!config.scheduleTime) {
                    let newState = this._getOppositeState(this.gpio.readSync());
                    this.gpio.write(newState, (err) => {
                        this._writeCallback(err);
                        if (!config.feedbackGpioNumber) {
                            this.sendState(null, newState);
                        }
                    });
                } else {
                    //if timeout is already scheduled then ignore other requestes
                    if (this.scheduleTimeout) {
                        return;
                    }
                    this.gpio.write(1, this._writeCallback);
                    this.scheduleTimeout = setTimeout(() => {
                        this.scheduleTimeout = null;
                        this.gpio.write(0, this._writeCallback);
                    }, config.scheduleTime);
                }
            }
        });
    }

    public close() {
        this.gpio.unexport();
        if (this.feedback) {
            this.feedback.unexport();
        }
    }

    // calculate new state by subtracting current value from 1 (1-0 = 1, 1-1 = 0)
    private _getOppositeState = (oldState: BinaryValue): BinaryValue =>
        (1 - oldState) as BinaryValue;

    private _writeCallback = (err: Error | null | undefined) => {
        if (err) {
            this.sendState(err);
            return;
        }
    };

    private _readCallback: ValueCallback = (err, value) => {
        this.sendState(err, value);
    };
}
