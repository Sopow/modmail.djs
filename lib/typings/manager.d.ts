import { EventEmitter } from "events";
import { Client } from "discord.js";
import { ManagerOptions } from "./interfaces";
export default class Manager extends EventEmitter {
    constructor(client: Client, options: ManagerOptions);
    private readonly client;
    private readonly config;
    setModmail(): void;
}
