import { Night } from "./appearance";
import { Gains as MCP3424Gains, Resolutions as MCP3424Resolutions } from "./io/mcp3424";
import { OnOffConfig } from "./io/onoff";
import { AdcChannelConfig } from "./io/adcchannel";
export interface Config {
    appearance: Appearance;
    io: IO;
}

export interface Appearance {
    iniFilePath: string;
    watchForChanges: boolean;
    watchingInterval: number;
    fallbackValues: FallbackValues;
}

export interface FallbackValues {
    colors: Night;
}

export interface MCP3424Options {
    address: number;
    resolution: MCP3424Resolutions;
    gain: MCP3424Gains;
    busNumber: number;
    readingInterval: number;
    changeInsensitivity: number;
}

export interface IO {
    mcp3424: MCP3424Options;
    adcChannels: AdcChannelConfig[];
    onoffs: OnOffConfig[];
}

const config: Config = {
    appearance: {
        iniFilePath: "/home/pi/.openauto/config/openauto_system.ini",
        watchForChanges: true,
        watchingInterval: 4000,
        fallbackValues: {
            colors: {
                WallpaperPath: "",
                WallpaperMode: "1",
                WallpaperOpacity: "100",
                BackgroundColor: "#4b4b4b",
                HighlightColor: "#f5b42a",
                ControlBackground: "#000000",
                ControlForeground: "#f5b42a",
                NormalFontColor: "#ffffff",
                SpecialFontColor: "#f5b42a",
                DescriptionFontColor: "#888888",
                BarBackgroundColor: "#000000",
                ControlBoxBackgroundColor: "#303030",
                GaugeIndicatorColor: "#f5b42a",
                IconShadowColor: "#80000000",
                IconColor: "#ffffff",
                SideWidgetBackgroundColor: "#000000",
                BarShadowColor: "#333333",
            },
        },
    },

    io: {
        mcp3424: {
            address: 0x6c,
            resolution: 1,
            gain: 0,
            busNumber: 1,
            readingInterval: 20,
            changeInsensitivity: 10,
        },
        adcChannels: [
            {
                name: "oilpressure.0",
                adcChannel: 0,
                minValue: 0.0,
                maxValue: 10.0,
                minVoltage: 0,
                maxVoltage: 4.5,
            },
        ],
        onoffs: [
            {
                name: "foglights.0",
                gpioNumber: 19,
                offState: 1,
            },
        ],
    },
};

export default config;
