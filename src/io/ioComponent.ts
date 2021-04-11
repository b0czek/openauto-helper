import { IOs } from "./io";

export default class IOComponent {
    protected ios: IOs;
    protected name: string;
    constructor(name: string, ios: IOs) {
        this.ios = ios;
        this.name = name;
    }
}
