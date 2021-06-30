import { Gpio, ValueCallback } from "onoff";
import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";

export interface GPIOBufferConfig extends IOComponentConfig {
    inputGpio: number;
    outputGpio: number;
    activeLow: boolean;
    bufferInterval: number;
}

export default class GPIOBuffer extends IOComponent {
    private input: Gpio;
    private output: Gpio;
    private bufferTimeout: NodeJS.Timeout | null = null;
    private config: GPIOBufferConfig;

    constructor(config: GPIOBufferConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        this.input = new Gpio(this.config.inputGpio, "in", "both", {
            activeLow: this.config.activeLow,
        });
        this.output = new Gpio(this.config.outputGpio, "out", "both", {
            activeLow: this.config.activeLow,
        });
        this.output.writeSync(this.input.readSync());
        this.input.watch(this._readCallback);
    }

    private _readCallback: ValueCallback = (err, value) => {
        if (err) {
            return;
        }
        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = null;
        }
        if (value) {
            this.output.write(value, (err) => {
                if (err) {
                    return;
                }
            });
        } else {
            this.bufferTimeout = setTimeout(() => {
                this.output.writeSync(0);
                this.bufferTimeout = null;
            }, this.config.bufferInterval);
        }
    };

    public close() {
        this.input.unexport();
        this.output.unexport();
    }
}
