import { IpcMain, WebContents } from "electron";

import cfg from "../config";
import MCP3424, { MCP3424Config } from "./adc/mcp3424";
import AdcChannel, { AdcChannelConfig } from "./adcchannel";
import OnOff, { OnOffConfig } from "./onoff";
import DS18B20, { DS18B20Config } from "./ds18b20";
import GPIOBuffer, { GPIOBufferConfig } from "./gpiobuffer";
import LightSensor, { LightSensorConfig } from "./lightsensor/tsl2561";
import FileHandler, { FileHandlerConfig } from "./filehandler";
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
    adcchannel: AdcChannel,
    ds18b20: DS18B20,
    gpiobuffer: GPIOBuffer,
    lightsensor: LightSensor,
    filehandler: FileHandler,
    daynight: DayNight,
    modemsignal: ModemSignal,
};

export type ComponentClasses = "adc";

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
            import(this.buildComponentPath(component))
                .then((c) => {
                    let ComponentConstructor = c.default;
                    this.components.push(
                        new ComponentConstructor(component, this.ios, ...this.appendDependencies(component))
                    );
                })
                .catch((err) => {
                    console.error(`${component.name} could not be initialized: ${err.toString()}`);
                });
        }
    }
    private buildComponentPath(config: ComponentConfigs): string {
        return `./${config.class ? `${config.class}/${config.type}` : config.type}`;
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
