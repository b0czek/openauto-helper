import { contextBridge, ipcRenderer } from "electron";
import AppAppearance from "./appearance";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    send: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel: string, func: (...args: any) => void) => {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (_, ...args) => func(...args));
    },
});
contextBridge.exposeInMainWorld("appearance", AppAppearance.readColorConfig());
