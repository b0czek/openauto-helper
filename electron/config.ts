import { appearanceFallback } from "./appearance";
import { IOConfig, Compontents } from "./io/io";
export interface Config {
    io: IOConfig;
}

const config: Config = {
    io: {
        mcp3424: {
            address: 0x6c,
            resolution: 1,
            gain: 0,
            busNumber: 1,
            // interval specifies interval for reading one channel
            readingInterval: 100,
            changeInsensitivity: 50,
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
                readingInterval: 1000,
                changeInsensitivity: 10,
            },
            {
                type: "daynight",
                name: "daynight",
                auxDependencies: "lightSensor",
                outputGpio: 17,
                threshold: 150,
                maxErrorStreak: 5,
                criticalThreshold: 50,
                criticalStreak: 2,
                sampleSize: 50,
                switchInterval: 90,
                deadZone: 0.05,
            },
            {
                type: "filehandler",
                name: "appearance",
                filepath: "/home/pi/.openauto/config/openauto_system.ini",
                filetype: "ini",
                writable: false,
                fallback: appearanceFallback,
                watchForChanges: true,
            },
        ],
    },
};

export default config;
