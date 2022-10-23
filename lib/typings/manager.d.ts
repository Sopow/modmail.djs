import { EventEmitter } from "events";
import { Client } from "discord.js";
import { ManagerOptions } from "./interfaces";
export default class Manager extends EventEmitter {
    constructor(client: Client, options: ManagerOptions);
    readonly client: Client;
    readonly config: ManagerOptions;
    setModmail(): void;
}
