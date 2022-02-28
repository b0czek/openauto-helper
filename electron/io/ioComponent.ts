import { RendererIO, ComponentTypes, ComponentNames, ComponentConfigs, ComponentClasses, Components } from "./io";
import lodash from "lodash";
import { ipcMain } from "electron";
// generic component config
export interface IOComponentConfig {
    name: string;
    type: ComponentNames;
    class?: ComponentClasses;
    auxDependencies?: string | string[];
}

// class base for other compontents to inherit from
export default abstract class IOComponent {
    protected ios: RendererIO;
    public name: string;
    public type: ComponentNames;
    public class?: ComponentClasses;

    //              component config     io to frontend      auxilliary components
    constructor(opts: IOComponentConfig, ios: RendererIO, ..._aux: AuxIOComponent[]) {
        this.ios = ios;
        this.name = opts.name;
        this.type = opts.type;
        this.class = opts.class;
    }
    protected setStateHandler(callback: Parameters<typeof ipcMain.handle>[1], channelSuffix?: string) {
        this.log(`setting handler on ${this._buildChannelName(channelSuffix)}`);
        this.ios.ipcMain.handle(this._buildChannelName(channelSuffix), callback);
    }
    protected setStateListener(callback: Parameters<typeof ipcMain.on>[1], channelSuffix?: string) {
        this.log(`setting listener on ${this._buildChannelName(channelSuffix)}`);
        this.ios.ipcMain.on(this._buildChannelName(channelSuffix), callback);
    }
    protected sendState(err: any, data?: any, channelSuffix?: string) {
        this.ios.webContents.send(this._buildChannelName(channelSuffix), err, data);
    }

    protected getAuxComponent<T extends ComponentNames, P extends ComponentClasses, K extends AuxIOComponent>(
        specifier: (Partial<ComponentConfigs> & { type: T }) | { class: P },
        aux: K[]
    ): K {
        let result = lodash.filter(aux, lodash.matches(specifier));
        if (result.length === 0) {
            throw new Error(
                `${"type" in specifier ? specifier.type : specifier.class} component was not provided to ${
                    this.name
                } component`
            );
        }
        return result[0];
    }

    protected log = (message: any) => console.log(this.buildMessage(message, "INFO"));
    protected warn = (message: any) => console.warn("\x1b[33m%s\x1b[0m", this.buildMessage(message, "WARN"));
    protected error = (message: any) => console.error("\x1b[31m%s\x1b[0m", this.buildMessage(message, "ERROR"));

    private buildMessage(message: any, type: string): string {
        return `[${type}: ${this.getTime()}](${this.type}-${this.name}): ${message}`;
    }
    private getTime(): string {
        let now = new Date();
        const lPad = (n: number) => n.toString().padStart(2, "0");
        return `${lPad(now.getHours())}:${lPad(now.getMinutes())}:${lPad(now.getSeconds())}`;
    }

    private _buildChannelName = (suffix?: string): string => (suffix ? `${this.name}:${suffix}` : this.name);

    public abstract close(): void;
}

export type Callback = (err: any, value: number | null) => void;

export interface CallbackData {
    callback: Callback;
    type: "any" | "change";
}

export abstract class AuxIOComponent extends IOComponent {
    // value 'getter'
    abstract getValue(...args: any[]): number | null;
    // watch for readings outside change insensitivity
    abstract watchForChanges(cb: Callback, ...args: any[]): void;
    // watch for any reading
    abstract watch(cb: Callback, ...args: any[]): void;
    // remove
    abstract unwatch(cb: Callback, ...args: any[]): void;
}

/**
 * IOComponent extending class template

import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";

export interface ComponentConfig extends IOComponentConfig {}

export default class Component extends IOComponent {
    constructor(config: ComponentConfig, ios: RendererIO) {
        super(config, ios);
    }

}

 */
