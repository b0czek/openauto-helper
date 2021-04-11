import cfg from "../config";
import { IOs } from "./io";
import IOComponent from "./ioComponent";
import MCP3424 from "./mcp3424";

const config = cfg.oilPressure;

export default class OilPressure extends IOComponent {
    private mcp: MCP3424;

    constructor(name: string, ios: IOs, mcp: MCP3424) {
        super(name, ios);
        this.mcp = mcp;
        this.mcp.watch(config.adcChannel, (err) => {
            console.log(this.mcp.getVoltage(config.adcChannel));
            this._sendState(err);
        });
        this.ios.ipcMain.on(name, (_) => {
            this._sendState(null);
        });
    }
    private _sendState(err: any) {
        this.ios.webContents.send(this.name, err, this.mcp.getVoltage(config.adcChannel));
    }
}
