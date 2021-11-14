import fs from "fs";
import ini from "iniparser";
import lodash from "lodash";

import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";

export interface FileHandlerConfig extends IOComponentConfig {
    // path to handled file
    filepath: string;
    // type of handled file, raw is pure text,
    // json and ini will be parsed into objects
    filetype: "raw" | "json" | "ini";
    // will the handler accept write requests
    writable: boolean;
    // data to use when file is inaccessible
    fallback?: string | object;
    // should handler watch for changes in file and update data
    watchForChanges?: boolean;
}

export default class FileHandler extends IOComponent {
    private config: FileHandlerConfig;
    private fileWatcher: fs.FSWatcher | null = null;
    private fileData: string | object | null;
    private fileError: string | null = null;
    constructor(config: FileHandlerConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;

        this.fileData = this._readFile();
        if (this.config.watchForChanges && fs.existsSync(config.filepath)) {
            this.fileWatcher = fs.watch(
                config.filepath,
                {
                    encoding: "utf-8",
                    persistent: true,
                    recursive: false,
                },
                this._fileWatchCallback
            );
        }

        this.setStateListener((_, message: any) => {
            if (message === "read") {
                this.sendState(this.fileError, this.fileData);
            }
        });
        this.setStateHandler((_, data: string): boolean => {
            return this._updateFile(data);
        });
    }
    private _readFile() {
        try {
            let data: string | object;
            let rawFile = fs.readFileSync(this.config.filepath, { encoding: "utf-8" });
            switch (this.config.filetype) {
                case "raw":
                    data = rawFile;
                    break;
                case "json":
                    data = JSON.parse(rawFile);
                    break;
                case "ini":
                    data = ini.parseString(rawFile);
                    if (lodash.isEmpty(data)) {
                        throw new Error("Read config was empty");
                    }
                    break;
            }
            this.fileError = null;
            return data;
        } catch (err) {
            this.error(`error on reading file ${this.config.filepath}: ${err.toString()}`);
            if (this.config.fallback) {
                this.warn("falling back to default values");
                this.fileError = null;
                return this.config.fallback;
            } else {
                this.fileError = err.toString();
                return null;
            }
        }
    }
    private _updateFile(newData: string): boolean {
        if (!this.config.writable) return false;

        try {
            fs.writeFileSync(this.config.filepath, newData, { encoding: "utf-8" });
            // if handler does not watch for changes, manually update data
            if (!this.config.watchForChanges) {
                this.fileData = this._readFile();
            }
            return true;
        } catch {
            return false;
        }
    }
    private _fileWatchCallback = (event: "rename" | "change", _filename: string) => {
        if (event === "change") {
            let newConfig = this._readFile();
            if (newConfig !== null && !lodash.isEqual(newConfig, this.fileData)) {
                this.log(`Detected file ${this.config.filepath} content change`);
                this.fileData = newConfig;
                this.sendState(null, this.fileData);
            }
        }
    };
    public close() {
        if (this.fileWatcher) this.fileWatcher.close();
    }
}
