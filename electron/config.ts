import { Night } from "./appearance";
import { IOConfig, Compontents } from "./io/io";
export interface Config {
    appearance: Appearance;
    io: IOConfig;
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
            // interval specifies interval for reading one channel
            readingInterval: 100,
            changeInsensitivity: 10,
        },
        channels: [
            {
                type: "adcChannel",
                name: "oilpressure.0",
                adcChannel: 0,
                minValue: 0.0,
                maxValue: 5.0,
                minVoltage: 0.5,
                maxVoltage: 4.5,
            },
            {
                type: "onoff",
                name: "foglights.0",
                gpioNumber: 19,
                activeLow: false,
            },
            {
                type: "onoff",
                name: "eco.0",
                gpioNumber: 26,
                activeLow: false,
                feedbackGpioNumber: 21,
                scheduleTime: 500
            },
            {
                type: "ds18b20",
                name: "thermometer.0",
                sensorId: "28-0417b31c59ff",
                changeInsensitivity: 0.1,
                readingInterval: 1000,
            },
            {
                type: "gpioBuffer",
                name: "reverseCamera.0",
                inputGpio: 20,
                outputGpio: 27,
                activeLow: false,
                bufferInterval: 4000,
            },
        ],
    },
};

export default config;
