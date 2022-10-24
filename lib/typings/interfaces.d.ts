import { ClientEvents, Awaitable } from "discord.js";
import Manager from "../typings/manager";
export interface ManagerOptions {
    guildId: string;
    categoryId: string;
    role: string;
}
export interface Events {
    ready: [];
}
export declare type Event<K extends keyof ClientEvents> = (manager: Manager, ...args: ClientEvents[K]) => Awaitable<void>;
