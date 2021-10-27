type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export const appearanceFallback: RecursivePartial<OpenAutoConfig> = {
    Day: {
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
    Night: {
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

    Appearance: {
        ControlsOpacity: "25",
    },
};

// types from openauto_system.ini config file
//
//
//
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

export interface Colors {
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
    Day: Colors;
    Night: Colors;
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
