
const path = require('path');
const url = require('url');

const { app, BrowserWindow, ipcMain, webContents } = require('electron')

const sensors = require('./sensors');

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 1600,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, "preload.js"), // use a preload script
        },
    })
    // win.removeMenu();
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'public', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    sensors.start(
        (voltage) => {
            console.log('vlauechanged to ' + voltage);
            win.webContents.send('voltage', voltage);
        }
    );
    win.setPosition(0, 0);
    win.setFullScreen(true);


    ipcMain.on('valuesRequest', _ => {
        win.webContents.send('voltage', sensors.getVoltage());
        console.log('got hit on valuesrequest');
    });

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});



const colors = require('./colors');
colors.readColorConfig();