"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const fs_1 = require("fs");
class Manager extends events_1.EventEmitter {
    constructor(client, options) {
        super();
        if (!client)
            throw new Error("Client is required");
        if (!options || typeof options !== "object")
            throw new Error("Options are required");
        client.on("ready", require("../events/ready").event.bind(null, this));
        this.client = client;
        this.config = options;
    }
    client;
    config;
    setModmail() {
        (0, fs_1.readdir)("../events", (err, files) => {
            if (err)
                throw err;
            files.filter(file => file != "ready.js" && file.endsWith(".js")).forEach(file => this.client.on("ready", require(`../events/${file}`).event.bind(null, this)));
        });
        this.emit("ready");
    }
}
exports.default = Manager;
