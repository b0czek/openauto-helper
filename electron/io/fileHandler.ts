import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import fs from "fs";
import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

export interface FileHandlerConfig extends IOComponentConfig {
    filepath: string;
    filetype: "raw" | "json";
    writable: boolean;
}

export default class Component extends IOComponent {
    private config: FileHandlerConfig;
    private file: string | object | null;
    private fileError: string | null = null;
    constructor(config: FileHandlerConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        try {
            let rawFile = fs.readFileSync(config.filepath, { encoding: "utf-8" });
            if (config.filetype == "json") this.file = JSON.parse(rawFile);
            else if (config.filetype == "raw") this.file = rawFile;
        } catch (err) {
            console.error(`could not open file ${config.filepath}`);
            this.fileError = err.toString();
            this.file = null;
        }
        this.ios.ipcMain.on(this.name, (_: IpcMainEvent, message: any) => {
            if (message === "read") {
                this.sendState(this.fileError, this.file);
            }
        });
        this.ios.ipcMain.handle(`${this.name}`, (_: IpcMainInvokeEvent, data: string): boolean => {
            return this._updateFile(data);
        });
    }

    private _updateFile(newData: string): boolean {
        if (!this.config.writable) return false;

        try {
            fs.writeFileSync(this.config.filepath, newData, { encoding: "utf-8" });
            return true;
        } catch {
            return false;
        }
    }
}
