import path from "path";
import url from "url";

import { app, BrowserWindow, ipcMain } from "electron";

import IO from "./io/io";

function createWindow() {
    const win = new BrowserWindow({
        width: 450,
        height: 1600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "public", "index.html"),
            protocol: "file:",
            slashes: true,
        })
    );
    win.setPosition(0, 0);
    win.setFullScreen(true);

    IO.init(win.webContents, ipcMain);
}
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
