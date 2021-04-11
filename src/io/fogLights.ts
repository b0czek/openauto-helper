import { Gpio } from "onoff";
import cfg from "../config";
import { IpcRenderer, WebContents } from "electron";
import { IOs } from "./io";
import IOComponent from "./ioComponent";

const config = cfg.fogLights;

export default class FogLights extends IOComponent {
    private gpio: Gpio;
    constructor(name: string, ios: IOs) {
        super(name, ios);
        this.gpio = new Gpio(config.gpioNumber, "out", "both");
    }
}
