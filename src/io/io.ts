import { IpcMain, WebContents } from "electron";

import cfg from "../config";

import MCP3424 from "./mcp3424";
import AdcChannel from "./adcchannel";
import OnOff from "./onoff";

const config = cfg.io;

// bad design borrowing those to suncompontents but it reduces unneeded code
export interface IOs {
    webContents: WebContents;
    ipcMain: IpcMain;
}

export default class IO {
    private static ios: IOs;
    public static init = (webContents: WebContents, ipcMain: IpcMain) => {
        IO.ios = {
            webContents,
            ipcMain,
        };
        const adc = new MCP3424(config.mcp3424);
        const adcChannels: AdcChannel[] = [];
        for (let channel of config.adcChannels) {
            adcChannels.push(new AdcChannel(channel, IO.ios, adc));
        }

        const onoffs: OnOff[] = [];
        for (let onoff of config.onoffs) {
            onoffs.push(new OnOff(onoff, IO.ios));
        }
    };
}
