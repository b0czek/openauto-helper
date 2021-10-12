import { RendererIO, Compontents } from "./io";

export interface IIOComponent extends IOComponentConfig {
    close: () => void;
}

export interface IOComponentConfig {
    name: string;
    type: Compontents;
}

// class base for other compontents to inherit from
export default class IOComponent implements IIOComponent {
    protected ios: RendererIO;
    public name: string;
    public type: Compontents;
    //              component config     io to frontend    any other auxilliary parameters
    constructor(opts: IOComponentConfig, ios: RendererIO, ..._aux: any) {
        this.ios = ios;
        this.name = opts.name;
        this.type = opts.type;
    }
    protected sendState(err: any, data?: any) {
        this.ios.webContents.send(this.name, err, data);
    }
    public close() {
        console.log(`closing ${this.name}`);
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
