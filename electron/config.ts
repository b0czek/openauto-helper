import { IAppearanceConfig } from "./appearance";
import { IOConfig, Compontents } from "./io/io";
export interface Config {
    appearance: IAppearanceConfig;
    io: IOConfig;
}

const config: Config = {
    appearance: {
        iniFilePath: "/home/pi/.openauto/config/openauto_system.ini",
        fallbackValues: {
            colors: {
                day: {
                    WallpaperPath: "",
                    WallpaperMode: "0",
                    WallpaperOpacity: "100",
                    BackgroundColor: "#4b4b4b",
                    HighlightColor: "#1f85ff",
                    ControlBackground: "#e2e2e2",
                    ControlForeground: "#1f85ff",
                    NormalFontColor: "#000000",
                    SpecialFontColor: "#000000",
                    DescriptionFontColor: "#202020",
                    BarBackgroundColor: "#b2b2b2",
                    ControlBoxBackgroundColor: "#808080",
                    GaugeIndicatorColor: "#f5b42a",
                    IconShadowColor: "#60000000",
                    IconColor: "#000000",
                    SideWidgetBackgroundColor: "#b2b2b2",
                    BarShadowColor: "#333333",
                },
                night: {
                    WallpaperPath: "",
                    WallpaperMode: "0",
                    WallpaperOpacity: "100",
                    BackgroundColor: "#4b4b4b",
                    HighlightColor: "#f5b42a",
                    ControlBackground: "#000000",
                    ControlForeground: "#f5b42a",
                    NormalFontColor: "#ffffff",
                    SpecialFontColor: "#f5b42a",
                    DescriptionFontColor: "#888888",
                    BarBackgroundColor: "#000000",
                    ControlBoxBackgroundColor: "#181818",
                    GaugeIndicatorColor: "#f5b42a",
                    IconShadowColor: "#80000000",
                    IconColor: "#ffffff",
                    SideWidgetBackgroundColor: "#000000",
                    BarShadowColor: "#333333",
                },
            },
            opacity: 0.25,
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
                scheduleTime: 500,
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
            {
                type: "lightsensor",
                name: "lightSensor",
                address: 0x39,
                busNumber: 1,
                readingInterval: 2000,
                changeInsensitivity: 20,
                radicalReassuranceReadings: 3,
                radicalThreshold: Math.round(Math.pow(2, 16) / 10),
            },
        ],
    },
};

export default config;
