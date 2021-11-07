import { RendererIO, ComponentTypes, ComponentNames, ComponentConfigs, Components } from "./io";
import lodash from "lodash";
// generic component config
export interface IOComponentConfig {
    name: string;
    type: ComponentNames;
    auxDependencies?: string | string[];
}
export type AuxComponentReturnType<T extends ComponentNames> = InstanceType<typeof ComponentTypes[T]>;
// class base for other compontents to inherit from
export default abstract class IOComponent {
    protected ios: RendererIO;
    public name: string;
    public type: ComponentNames;

    //              component config     io to frontend      auxilliary components
    constructor(opts: IOComponentConfig, ios: RendererIO, ..._aux: Components[]) {
        this.ios = ios;
        this.name = opts.name;
        this.type = opts.type;
    }
    protected sendState(err: any, data?: any) {
        this.ios.webContents.send(this.name, err, data);
    }

    protected getAuxComponent<T extends ComponentNames>(
        specifier: Partial<ComponentConfigs> & { type: T },
        aux: Components[]
    ): AuxComponentReturnType<T> {
        let result = lodash.filter(aux, lodash.matches(specifier));
        if (result.length === 0) {
            throw new Error(`${specifier.type} component was not provided to ${this.name} component`);
        }
        return <AuxComponentReturnType<T>>result[0];
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

    public close() {
        this.log(`closing ${this.name}`);
    }
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
