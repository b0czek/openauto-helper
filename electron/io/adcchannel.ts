import IO, { RendererIO } from "./io";
import IOComponent, { AuxIOComponent, IOComponentConfig } from "./ioComponent";
import MCP3424, { Channels } from "./adc/mcp3424";

export interface AdcChannelConfig extends IOComponentConfig {
    adcChannel: Channels;
    minValue: number;
    maxValue: number;
    minVoltage: number;
    maxVoltage: number;
}

export default class AdcChannel extends IOComponent {
    private mcp: AuxIOComponent;
    private config: AdcChannelConfig;

    constructor(config: AdcChannelConfig, ios: RendererIO, ...aux: AuxIOComponent[]) {
        super(config, ios);
        this.config = config;

        this.mcp = this.getAuxComponent({ type: "mcp3424" }, aux);
        this.mcp.watch(this._mcpCallback, config.adcChannel);

        this.setStateListener(() => {
            this.sendState(null, this._getValue());
        });
    }
    public close() {
        this.mcp.unwatch(this._mcpCallback, this.config.adcChannel);
    }

    private _mcpCallback = (err: any, voltage: number | null) => {
        if (err || voltage === null) {
            this.sendState(err);
            return;
        }
        let value = this._calculateValue(voltage);
        this.sendState(null, value);
    };

    private _getValue = () => this._calculateValue(this.mcp.getValue(this.config.adcChannel));

    private _calculateValue(voltage: number | null): number {
        let { maxValue, maxVoltage, minValue, minVoltage } = this.config;
        if (voltage === null || voltage < minVoltage) {
            return 0;
        }
        // https://stackoverflow.com/questions/51494376/how-to-transform-one-numerical-scale-into-another
        // x in [a,b] => z = (d-c) * (x-a) / (b-a) + c in [c,d]
        return ((maxValue - minValue) * (voltage - minVoltage)) / (maxVoltage - minVoltage) + minValue;
    }
}
