import { Client } from "discord.js";
import { EventEmitter } from "events";
import { Events, ManagerOptions } from "./typings/interfaces";

export class Manager extends EventEmitter {
  constructor(client: Client, options: ManagerOptions)

  public client: Client;
  public config: ManagerOptions;

  public on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

  public once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

  public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;

  public off<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;

  public removeAllListeners<K extends keyof Events>(event?: K): this;
}