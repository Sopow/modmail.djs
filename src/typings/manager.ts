import { EventEmitter } from "events"
import { Client } from "discord.js";
import { ManagerOptions } from "./interfaces";
import { readdir } from "fs";

export default class Manager extends EventEmitter {
  constructor(client: Client, options: ManagerOptions) {
    super();

    if (!client) throw new Error("Client is required");
    if (!options || typeof options !== "object") throw new Error("Options are required");

    client.on("ready", require("../events/ready").event.bind(null, this))

    this.client = client;
    this.config = options;
  }

  public readonly client: Client;
  public readonly config: ManagerOptions;

  public setModmail() {
    readdir("../events", (err, files) => {
      if (err) throw err;

      files.filter(file => file != "ready.js" && file.endsWith(".js")).forEach(file => this.client.on("ready", require(`../events/${file}`).event.bind(null, this)))
    })

    this.emit("ready");
  }
}