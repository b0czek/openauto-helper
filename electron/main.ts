import path from "path";
import isDev from "electron-is-dev";
import { app, BrowserWindow, ipcMain } from "electron";

import IO from "./io/io";

const createWindow = async () => {
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

    if (isDev) {
        // load dev server
        win.loadURL("http://localhost:3000/index.html");

        // hot reloading
        require("electron-reload")(__dirname, {
            electron: path.join(__dirname, "..", "..", "node_modules", ".bin", "electron"),
            forceHardReset: true,
            hardResetMethod: "exit",
        });

        //open dev tools
        win.webContents.openDevTools({
            mode: "detach",
        });
    } else {
        win.loadURL(`file://${__dirname}/../index.html`);
    }

    win.setPosition(0, 0);
    win.setFullScreen(true);

    IO.init(win.webContents, ipcMain);
};
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        IO.close();
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
