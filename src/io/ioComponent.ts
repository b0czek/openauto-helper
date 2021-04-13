import { IOs } from "./io";

// class base for other compontents to inherit from
export default class IOComponent {
    protected ios: IOs;
    protected name: string;
    constructor(name: string, ios: IOs) {
        this.ios = ios;
        this.name = name;
    }
    protected sendState(err: any, data?: any) {
        this.ios.webContents.send(this.name, err, data);
    }
}
