import MCP3424 from "./mcp3424";
import OilPressure from "./oilPressure";
import config from "../config";
import { IpcMain, WebContents } from "electron";

export interface IOs {
    webContents: WebContents;
    ipcMain: IpcMain;
}

export default class IO {
    private static ios: IOs;
    // bad design but reduces unneeded code
    public static init = (webContents: WebContents, ipcMain: IpcMain) => {
        IO.ios = {
            webContents,
            ipcMain,
        };
        const adc = new MCP3424(config.mcp3424);
        const oilPressure = new OilPressure("oilpressure.0", IO.ios, adc);
    };
}
