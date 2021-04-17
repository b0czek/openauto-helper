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
    constructor(opts: IOComponentConfig, ios: RendererIO) {
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
