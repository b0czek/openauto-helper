import { Gpio, ValueCallback, BinaryValue } from "onoff";
import { IOs } from "./io";
import IOComponent from "./ioComponent";

export interface OnOffConfig {
    name: string;
    gpioNumber: number;
    offState: BinaryValue;
}

export default class OnOff extends IOComponent {
    private gpio: Gpio;
    private config: OnOffConfig;
    constructor(config: OnOffConfig, ios: IOs) {
        super(config.name, ios);
        this.config = config;

        this.gpio = new Gpio(this.config.gpioNumber, "out", "both");

        //initialize pin to offstate
        this.gpio.writeSync(this.config.offState);

        //watch for its changes
        this.gpio.watch(this._readCallback);

        //watch for requestes from frontend
        this.ios.ipcMain.on(this.name, (message: any) => {
            // if the message is read, send the current gpio state back
            if (message === "read") {
                this.gpio.read(this._readCallback);
            }
            // if the message is toggle, flip the state
            else if (message === "toggle") {
                // calculate new state by subtracting current value from 1 (1-0 = 1, 1-1 = 0)
                let newState = (1 - this.gpio.readSync()) as BinaryValue;
                this.gpio.write(newState, (err) => {
                    if (err) {
                        this.sendState(err);
                    }
                });
            }
        });
    }

    private _readCallback: ValueCallback = (err, value) => this.sendState(err, value);
}
