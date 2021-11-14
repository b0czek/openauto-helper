import { appearanceFallback } from "./appearance";
import { IOConfig } from "./io/io";
export interface Config {
    io: IOConfig;
}

const config: Config = {
    io: {
        components: [
            {
                type: "mcp3424",
                name: "adc",
                address: 0x6c,
                resolution: 1,
                gain: 0,
                busNumber: 1,
                // interval specifies interval for reading one channel
                readingInterval: 100,
                changeInsensitivity: 50,
            },
            {
                type: "adcChannel",
                name: "oilpressure",
                adcChannel: 0,
                minValue: 0.0,
                maxValue: 5.0,
                minVoltage: 0.5,
                maxVoltage: 4.5,
                auxDependencies: "adc",
            },
            {
                type: "onoff",
                name: "foglights",
                gpioNumber: 19,
                activeLow: false,
            },
            {
                type: "onoff",
                name: "eco",
                gpioNumber: 26,
                activeLow: false,
                feedbackGpioNumber: 21,
                scheduleTime: 500,
            },
            {
                type: "ds18b20",
                name: "thermometer",
                sensorId: "28-0417b31c59ff",
                changeInsensitivity: 0.1,
                readingInterval: 1000,
            },
            {
                type: "gpioBuffer",
                name: "reverseCamera",
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
                threshold: 200,
                maxErrorStreak: 5,
                criticalThreshold: 100,
                criticalStreak: 4,
                sampleSize: 50,
                switchInterval: 90 * 1000,
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
