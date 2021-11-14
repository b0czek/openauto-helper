import { IpcMain, WebContents } from "electron";

import cfg from "../config";
import MCP3424, { MCP3424Config } from "./adc/mcp3424";
import AdcChannel, { AdcChannelConfig } from "./adcchannel";
import OnOff, { OnOffConfig } from "./onoff";
import DS18B20, { DS18B20Config } from "./ds18b20";
import GPIOBuffer, { GPIOBufferConfig } from "./gpiobuffer";
import LightSensor, { LightSensorConfig } from "./lightsensor";
import FileHandler, { FileHandlerConfig } from "./fileHandler";
import DayNight, { DayNightConfig } from "./daynight";
import ModemSignal, { ModemSignalConfig } from "./modemsignal";

const config = cfg.io;

export interface RendererIO {
    webContents: WebContents;
    ipcMain: IpcMain;
}
export const ComponentTypes = {
    mcp3424: MCP3424,
    onoff: OnOff,
    adcChannel: AdcChannel,
    ds18b20: DS18B20,
    gpioBuffer: GPIOBuffer,
    lightsensor: LightSensor,
    filehandler: FileHandler,
    daynight: DayNight,
    modemsignal: ModemSignal,
};

export type ComponentNames = keyof typeof ComponentTypes;
export type ComponentsConstructors = typeof ComponentTypes[ComponentNames];
export type Components = InstanceType<ComponentsConstructors>;
const Types: Record<ComponentNames, ComponentsConstructors> = ComponentTypes;

export type ComponentConfigs =
    | MCP3424Config
    | OnOffConfig
    | AdcChannelConfig
    | DS18B20Config
    | GPIOBufferConfig
    | LightSensorConfig
    | FileHandlerConfig
    | DayNightConfig
    | ModemSignalConfig;

export interface IOConfig {
    components: ComponentConfigs[];
}

export default class IO {
    private ios: RendererIO;
    private components: Components[] = [];
    public constructor(webContents: WebContents, ipcMain: IpcMain) {
        this.ios = {
            webContents,
            ipcMain,
        };
        for (let component of config.components) {
            try {
                if (component.type in Types) {
                    let IOConstructor = Types[component.type];
                    // @ts-expect-error
                    // config parameter in constructor is intersected and
                    // would require every field of every type of config to be filled
                    // but they must be complete for a specific type anyway
                    this.components.push(new IOConstructor(component, this.ios, ...this.appendDependencies(component)));
                } else {
                    throw new Error("Invalid component configuration");
                }
            } catch (err) {
                console.error(`${component.name} could not be initialized: ${err.toString()}`);
            }
        }
    }
    private appendDependencies(component: ComponentConfigs): Components[] {
        if ("auxDependencies" in component && component.auxDependencies) {
            let dependencies = component["auxDependencies"];
            // if dependency is a string, convert it into [string]
            dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];
            return this.components.filter((c) => dependencies.includes(c.name));
        }
        return [];
    }

    public close = () => {
        for (let component of this.components) {
            console.log(`closing ${component.name}`);
            component.close();
        }
    };
}
