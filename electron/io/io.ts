import { IpcMain, WebContents } from "electron";

import cfg from "../config";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import MCP3424, { MCP3424Options } from "./mcp3424";
import AdcChannel, { AdcChannelConfig } from "./adcchannel";
import OnOff, { OnOffConfig } from "./onoff";
import DS18B20, { DS18B20Config } from "./ds18b20";
import GPIOBuffer, { GPIOBufferConfig } from "./gpiobuffer";
import LightSensor, { LightSensorConfig } from "./lightsensor";

const config = cfg.io;

export interface RendererIO {
    webContents: WebContents;
    ipcMain: IpcMain;
}

export type Compontents =
    | "onoff"
    | "adcChannel"
    | "ds18b20"
    | "gpioBuffer"
    | "lightsensor";
export type Channel =
    | OnOffConfig
    | AdcChannelConfig
    | DS18B20Config
    | GPIOBufferConfig
    | LightSensorConfig;

export interface IOConfig {
    mcp3424: MCP3424Options;
    channels: Channel[];
}

export default class IO {
    private static ios: RendererIO;
    private static adc: MCP3424;
    private static channels: IOComponent[] = [];
    public static init = (webContents: WebContents, ipcMain: IpcMain) => {
        IO.ios = {
            webContents,
            ipcMain,
        };
        IO.adc = new MCP3424(config.mcp3424);
        for (let channel of config.channels) {
            let object: IOComponent;
            switch (channel.type) {
                case "onoff":
                    object = new OnOff(<OnOffConfig>channel, IO.ios);
                    break;
                case "adcChannel":
                    object = new AdcChannel(
                        <AdcChannelConfig>channel,
                        IO.ios,
                        IO.adc
                    );
                    break;
                case "ds18b20":
                    object = new DS18B20(<DS18B20Config>channel, IO.ios);
                    break;
                case "gpioBuffer":
                    object = new GPIOBuffer(<GPIOBufferConfig>channel, IO.ios);
                    break;
                case "lightsensor":
                    object = new LightSensor(
                        <LightSensorConfig>channel,
                        IO.ios
                    );
                    break;
                default:
                    throw new Error("Invalid channel configuration");
            }
            IO.channels.push(object);
        }
    };
    public static close = () => {
        for (let channel of IO.channels) {
            console.log(`closing ${channel.name}`);
            channel.close();
        }
        console.log("closing adc");
        IO.adc.close();
    };
}
