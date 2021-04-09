const config = {
    colors: {
        iniFilePath: '/home/pi/.openauto/config/openauto_system.ini',
        watchForChanges: true,
        watchingInterval: 4000,
        fallbackValues: {
            WallpaperPath: '',
            WallpaperMode: '1',
            WallpaperOpacity: '100',
            BackgroundColor: '#4b4b4b',
            HighlightColor: '#f5b42a',
            ControlBackground: '#000000',
            ControlForeground: '#f5b42a',
            NormalFontColor: '#ffffff',
            SpecialFontColor: '#f5b42a',
            DescriptionFontColor: '#888888',
            BarBackgroundColor: '#000000',
            ControlBoxBackgroundColor: '#303030',
            GaugeIndicatorColor: '#f5b42a',
            IconShadowColor: '#80000000',
            IconColor: '#ffffff',
            SideWidgetBackgroundColor: '#000000',
            BarShadowColor: '#333333'
        }
    },
    mcp3424: {
        address: 0x6C,
        resolution: 1,
        gain: 0,
        bus: '/dev/i2c-1',
        readingInterval: 20
    }
}

module.exports = config;