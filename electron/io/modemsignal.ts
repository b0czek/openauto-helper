import { Connection, Device, User, Monitoring } from "huawei-lte-api";
import { ResponseErrorException } from "huawei-lte-api/dist/exceptions";
import waitOn, { WaitOnOptions } from "wait-on";
import { isEqual } from "lodash";

import { RendererIO } from "./io";
import IOComponent, { IOComponentConfig } from "./ioComponent";

export interface ModemSignalConfig extends IOComponentConfig {
    username: string;
    password: string;
    routerIp: string;
    readingInterval: number;
}

export default class ModemSignal extends IOComponent {
    private connection: Connection;
    private monitoring: Monitoring;
    private config: ModemSignalConfig;
    private readTimeout: NodeJS.Timeout;
    private dataError: Error | null;
    private data: {} | null = null;

    constructor(config: ModemSignalConfig, ios: RendererIO) {
        super(config, ios);
        this.config = config;
        this.ios.ipcMain.on(this.name, () => {
            this.sendState(this.dataError, this.data);
        });

        this.openModem();
    }

    private waitForModem = async () => {
        let waitOnOptions: WaitOnOptions = {
            resources: [this.config.routerIp],
            timeout: 5000,
            tcpTimeout: 5000,
        };
        try {
            await waitOn(waitOnOptions);
        } catch {
            setImmediate(this.waitForModem);
        }
    };

    private openModem = async () => {
        await this.waitForModem();
        this.connection = new Connection(
            `http://${this.config.username}:${this.config.password}@${this.config.routerIp}`,
            2000
        );
        this.monitoring = new Monitoring(this.connection);
        return this.connection.ready
            .then(() => {
                this.readModem();
            })
            .catch((err) => {
                console.error(`${err.toString()}`);
                setTimeout(this.openModem, 5000);
            });
    };

    private readModem = async () => {
        console.log(`reading modem `);
        try {
            let response = await this.monitoring.status();
            if (!isEqual(this.data, response) || this.dataError) {
                this.dataError = null;
                this.data = response;
                this.sendState(null, this.data);
            }
        } catch (err) {
            if (err instanceof ResponseErrorException) {
                // reinitialize session
                await this.resetSession();
            } else if (err.code === "ETIMEDOUT") {
                // if requests times out, wait for host to be available again
                await this.waitForModem();
            } else {
                console.error(err.toString());
                this.dataError = err;
                this.data = null;
                this.sendState(this.dataError, null);
            }
        }

        this.readTimeout = setTimeout(this.readModem, this.config.readingInterval);
    };

    private resetSession = async () => {
        try {
            this.connection.reload();
            const user = new User(this.connection, this.config.username, this.config.password);
            await user.login();
        } catch (err) {
            console.error(err);
        }
    };
    public close() {
        clearTimeout(this.readTimeout);
    }
}
