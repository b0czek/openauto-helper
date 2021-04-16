import ini from "iniparser";
import lodash from "lodash";
import fs from "fs";
import cfg from "./config";

const config = cfg.appearance;

// i dont differentiate between day and night and stick to night
// because its hard to track actual mode
export const readColorConfig = (): Night => {
    let result: OpenAutoConfig;
    try {
        result = ini.parseSync<OpenAutoConfig>(config.iniFilePath);
    } catch {
        console.log("Color configuration could not be read, falling back to default values");
        return config.fallbackValues.colors;
    }

    return result.Night;
};

export const watchForConfigChanges = (callback: () => void) => {
    let lastReadConfig: Night = readColorConfig();
    fs.watchFile(
        config.iniFilePath,
        {
            interval: config.watchingInterval,
        },
        (curr: fs.Stats, _) => {
            console.log(`Detected config change at ${curr}.`);
            if (lodash.isEqual(readColorConfig(), lastReadConfig)) {
                callback();
            }
        }
    );
};

export const stopWatchingForChanges = () => {
    fs.unwatchFile(config.iniFilePath);
};

// iniparser parses everything to strings ¯\_(ツ)_/¯

export interface Units {
    ConsumptionUnit: string;
    DistanceUnit: string;
    TemperatureUnit: string;
}

export interface Appearance {
    TimeFormat: string;
    ShowTopBarInAndroidAuto: string;
    ShowTemperature: string;
    ShowClockInMirroring: string;
    ShowClockInAndroidAuto: string;
    ControlsOpacity: string;
    FontScale: string;
    Language: string;
}

export interface System {
    AndroidAutoAutostart: string;
    TouchscreenType: string;
    ScreenType: string;
    ScreenSplitPercentage: string;
    DownloadCoverart: string;
}

export interface Mirroring {
    ShowTopBarInMirroring: string;
    ResolutionWidth: string;
    ResolutionHeight: string;
}

export interface DayNight {
    OpenAutoDayNightControllerType: string;
    AndroidAutoDayNightControllerType: string;
    SunriseTime: string;
    SunsetTime: string;
    LightSensorThreshold: string;
    LightSensorDescriptor: string;
    LightSensorAddress: string;
    LightSensorMinRange: string;
    LightSensorMaxRange: string;
    OpenAutoDayNightMode: string;
    AndroidAutoDayNightMode: string;
    GpioPin: string;
}

export interface Day {
    WallpaperPath: string;
    WallpaperMode: string;
    WallpaperOpacity: string;
    BackgroundColor: string;
    HighlightColor: string;
    ControlBackground: string;
    ControlForeground: string;
    NormalFontColor: string;
    SpecialFontColor: string;
    DescriptionFontColor: string;
    BarBackgroundColor: string;
    ControlBoxBackgroundColor: string;
    GaugeIndicatorColor: string;
    IconShadowColor: string;
    IconColor: string;
    SideWidgetBackgroundColor: string;
    BarShadowColor: string;
}

export interface Night {
    WallpaperPath: string;
    WallpaperMode: string;
    WallpaperOpacity: string;
    BackgroundColor: string;
    HighlightColor: string;
    ControlBackground: string;
    ControlForeground: string;
    NormalFontColor: string;
    SpecialFontColor: string;
    DescriptionFontColor: string;
    BarBackgroundColor: string;
    ControlBoxBackgroundColor: string;
    GaugeIndicatorColor: string;
    IconShadowColor: string;
    IconColor: string;
    SideWidgetBackgroundColor: string;
    BarShadowColor: string;
}

export interface General {
    HandednessOfTraffic: string;
    ShowClock: string;
    HasTouchscreen: string;
    TemperatureSensorDescriptor: string;
}

export interface Video {
    FPS: string;
    Resolution: string;
    ScreenDPI: string;
    MarginWidth: string;
    MarginHeight: string;
    ProjectionOrientation: string;
}

export interface Audio {
    MusicAudioChannelEnabled: string;
    SpeechAudioChannelEnabled: string;
    SplashFilePath: string;
    PhoneNotificationFilePath: string;
    RingtoneFilePath: string;
    VolumeStep: string;
    MixerName: string;
    MuteMixerName: string;
    Autoplay: string;
    MediaStorageMusicVolumeLevel: string;
}

export interface Bluetooth {
    AdapterType: string;
    RemoteAdapterAddress: string;
}

export interface Obd {
    ObdAdapterStartupSequence: string;
    ObdAdapterDescriptor: string;
    ObdAdapterBaudrate: string;
    ObdProbePeriod: string;
    ObdDeviceType: string;
    ObdAdapterRfCommAddress: string;
    ObdAdapterRfCommChannel: string;
    ObdMaxNoDataResponseCount: string;
}

export interface RearCamera {
    DeviceDescriptor: string;
    GpioPin: string;
    ShowGuideLine: string;
    Orientation: string;
    ScriptPath: string;
    BackendType: string;
    ResolutionWidth: string;
    ResolutionHeight: string;
    ViewFinderIndex: string;
    VolumeLevelEnabled: string;
    VolumeLevel: string;
}

export interface Gestures {
    VolumeGestureEnabled: string;
    SensorDescriptor: string;
    Enabled: string;
    InactivityTimeout: string;
    SensorOrientation: string;
}

export interface Wireless {
    HotspotEnabled: string;
    Enabled: string;
    Ssid: string;
    Bssid: string;
    Key: string;
    Port: string;
    HotspotBand: string;
}

export interface Media {
    DefaultStoragePath: string;
}

export interface OpenAutoConfig {
    Units: Units;
    Appearance: Appearance;
    System: System;
    Mirroring: Mirroring;
    DayNight: DayNight;
    Day: Day;
    Night: Night;
    General: General;
    Video: Video;
    Audio: Audio;
    Bluetooth: Bluetooth;
    Obd: Obd;
    RearCamera: RearCamera;
    Gestures: Gestures;
    Wireless: Wireless;
    Media: Media;
}