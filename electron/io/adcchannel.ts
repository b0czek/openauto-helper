import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";
import MCP3424, { Channels } from "./mcp3424";

export interface AdcChannelConfig extends IOComponentConfig {
    adcChannel: Channels;
    minValue: number;
    maxValue: number;
    minVoltage: number;
    maxVoltage: number;
}

export default class AdcChannel extends IOComponent {
    private mcp: MCP3424;
    private config: AdcChannelConfig;

    constructor(config: AdcChannelConfig, ios: RendererIO, mcp: MCP3424) {
        super(config, ios);
        this.config = config;
        this.mcp = mcp;
        this.mcp.watch(config.adcChannel, (err) => {
            let value = this._calculateValue();

            this.sendState(err, value);
        });
        this.ios.ipcMain.on(this.name, (_) => {
            this.sendState(null, this._calculateValue());
        });
    }
    public close() {
        this.mcp.unwatch(this.config.adcChannel);
    }
    private _calculateValue(): number {
        let voltage = this.mcp.getVoltage(this.config.adcChannel);
        let { maxValue, maxVoltage, minValue, minVoltage } = this.config;
        if (voltage < minVoltage) {
            return 0;
        }
        // https://stackoverflow.com/questions/51494376/how-to-transform-one-numerical-scale-into-another
        // x in [a,b] => z = (d-c) * (x-a) / (b-a) + c in [c,d]
        return (
            ((maxValue - minValue) * (voltage - minVoltage)) / (maxVoltage - minVoltage) + minValue
        );
    }
}
