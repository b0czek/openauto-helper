import { Gpio, ValueCallback, BinaryValue } from "onoff";
import { IOs } from "./io";
import IOComponent from "./ioComponent";
import { IpcMainEvent } from "electron";

export interface OnOffConfig {
    name: string;
    gpioNumber: number;
    offState: BinaryValue;
    feedbackGpioNumber?: number;
    scheduleTime?: number;
}

export default class OnOff extends IOComponent {
    private gpio: Gpio;
    private feedback: Gpio;
    private scheduleTimeout: NodeJS.Timeout | null = null;
    private config: OnOffConfig;
    constructor(config: OnOffConfig, ios: IOs) {
        super(config.name, ios);
        this.config = config;

        this.gpio = new Gpio(this.config.gpioNumber, "out");
        // if pin has auxilliary pin for feedback provided
        if (config.feedbackGpioNumber) {
            this.feedback = new Gpio(config.feedbackGpioNumber, "in", "both");
            this.feedback.watch((err, value) => {
                console.log(err);
                console.log(value);
                this._readCallback(err, value);
            });
        }

        //initialize pin to offstate
        this.gpio.writeSync(this.config.offState);

        //watch for requestes from frontend
        this.ios.ipcMain.on(this.name, (_: IpcMainEvent, message: any) => {
            console.log(message);
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
                    this.gpio.write(
                        this._getOppositeState(this.config.offState),
                        this._writeCallback
                    );
                    this.scheduleTimeout = setTimeout(() => {
                        this.scheduleTimeout = null;
                        this.gpio.write(this.config.offState, this._writeCallback);
                    }, config.scheduleTime);
                }
            }
        });
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
