import { IpcMain, WebContents } from "electron";

import cfg from "../config";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import MCP3424, { MCP3424Options } from "./mcp3424";
import AdcChannel, { AdcChannelConfig } from "./adcchannel";
import OnOff, { OnOffConfig } from "./onoff";
import DS18B20, { DS18B20Config } from "./ds18b20";
import GPIOBuffer, { GPIOBufferConfig } from "./gpiobuffer";
import LightSensor, { LightSensorConfig } from "./lightsensor";
import FileHandler, { FileHandlerConfig } from "./fileHandler";
import DayNight, { DayNightConfig } from "./daynight";

const config = cfg.io;

export interface RendererIO {
    webContents: WebContents;
    ipcMain: IpcMain;
}
export type ComponentType = typeof IOComponent;
const ComponentTypes = {
    onoff: OnOff,
    adcChannel: AdcChannel,
    ds18b20: DS18B20,
    gpioBuffer: GPIOBuffer,
    lightsensor: LightSensor,
    filehandler: FileHandler,
    daynight: DayNight,
};

export type Compontents = keyof typeof ComponentTypes;
const Types: Record<Compontents, ComponentType> = ComponentTypes;

export type ComponentConfigs =
    | OnOffConfig
    | AdcChannelConfig
    | DS18B20Config
    | GPIOBufferConfig
    | LightSensorConfig
    | FileHandlerConfig
    | DayNightConfig;

export interface IOConfig {
    mcp3424: MCP3424Options;
    components: ComponentConfigs[];
}

export default class IO {
    private static ios: RendererIO;
    public static adc: MCP3424;
    private static components: IOComponent[] = [];
    public static init = (webContents: WebContents, ipcMain: IpcMain) => {
        IO.ios = {
            webContents,
            ipcMain,
        };
        IO.adc = new MCP3424(config.mcp3424);
        for (let component of config.components) {
            try {
                if (component.type in Types) {
                    let IOConstructor = Types[component.type];
                    IO.components.push(new IOConstructor(component, IO.ios, ...IO.appendDependencies(component)));
                } else {
                    throw new Error("Invalid component configuration");
                }
            } catch (err) {
                console.error(`${component.name} could not be initialized: ${err.toString()}`);
            }
        }
    };
    private static appendDependencies(component: ComponentConfigs): IOComponent[] {
        if ("auxDependencies" in component && component.auxDependencies) {
            let dependencies = component["auxDependencies"];
            // if dependency is a string, convert it into [string]
            dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];
            return IO.components.filter((c) => dependencies.includes(c.name));
        }
        return [];
    }

    public static close = () => {
        for (let component of IO.components) {
            console.log(`closing ${component.name}`);
            component.close();
        }
        console.log("closing adc");
        IO.adc.close();
    };
}
