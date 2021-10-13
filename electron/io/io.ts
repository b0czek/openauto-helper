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
export type ChannelType = typeof IOComponent;
const ChannelTypes = {
    onoff: OnOff,
    adcChannel: AdcChannel,
    ds18b20: DS18B20,
    gpioBuffer: GPIOBuffer,
    lightsensor: LightSensor,
    filehandler: FileHandler,
    daynight: DayNight,
};

export type Compontents = keyof typeof ChannelTypes;
const Types: Record<Compontents, ChannelType> = ChannelTypes;

export type Channel =
    | OnOffConfig
    | AdcChannelConfig
    | DS18B20Config
    | GPIOBufferConfig
    | LightSensorConfig
    | FileHandlerConfig
    | DayNightConfig;

export interface IOConfig {
    mcp3424: MCP3424Options;
    channels: Channel[];
}

export default class IO {
    private static ios: RendererIO;
    public static adc: MCP3424;
    private static channels: IOComponent[] = [];
    public static init = (webContents: WebContents, ipcMain: IpcMain) => {
        IO.ios = {
            webContents,
            ipcMain,
        };
        IO.adc = new MCP3424(config.mcp3424);
        for (let channel of config.channels) {
            try {
                if (channel.type in Types) {
                    let IOConstructor = Types[channel.type];
                    IO.channels.push(new IOConstructor(channel, IO.ios, ...IO.appendDependencies(channel)));
                } else {
                    throw new Error("Invalid channel configuration");
                }
            } catch (err) {
                console.error(`${channel.name} could not be initialized: ${err.toString()}`);
            }
        }
    };
    private static appendDependencies(channel: Channel): IOComponent[] {
        if ("auxDependencies" in channel) {
            let dependencies = channel["auxDependencies"];
            // if dependency is a string, convert it into [string]
            dependencies = Array.isArray(dependencies) ? dependencies : [dependencies];
            return IO.channels.filter((c) => dependencies.includes(c.name));
        }
        return [];
    }

    public static close = () => {
        for (let channel of IO.channels) {
            console.log(`closing ${channel.name}`);
            channel.close();
        }
        console.log("closing adc");
        IO.adc.close();
    };
}
