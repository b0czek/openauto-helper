import { IOs } from "./io";
import IOComponent from "./ioComponent";
import MCP3424, { Channels } from "./mcp3424";

export interface AdcChannelConfig {
    name: string;
    adcChannel: Channels;
    minValue: number;
    maxValue: number;
    minVoltage: number;
    maxVoltage: number;
}

export default class AdcChannel extends IOComponent {
    private mcp: MCP3424;
    private config: AdcChannelConfig;

    constructor(config: AdcChannelConfig, ios: IOs, mcp: MCP3424) {
        super(config.name, ios);
        this.config = config;
        this.mcp = mcp;
        this.mcp.watch(config.adcChannel, (err) => {
            let value = this._calculateValue();
            console.log(value);

            this.sendState(err, value);
        });
        this.ios.ipcMain.on(this.name, (_) => {
            this.sendState(null, this._calculateValue());
        });
    }
    private _calculateValue(): number {
        let voltage = this.mcp.getVoltage(this.config.adcChannel);
        let { maxValue, maxVoltage, minValue, minVoltage } = this.config;

        // https://stackoverflow.com/questions/51494376/how-to-transform-one-numerical-scale-into-another
        // x in [a,b] => z = (d-c) * (x-a) / (b-a) + c in [c,d]
        return (
            ((maxValue - minValue) * (voltage - minVoltage)) / (maxVoltage - minVoltage) + minValue
        );
    }
}
