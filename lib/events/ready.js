"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const event = ({ config }, client) => client.application?.fetch().then(app => {
    app.commands.create({
        description: "Setup the category of modmail system",
        name: "setup",
        options: [
            { description: "Category name", name: "category", type: discord_js_1.ApplicationCommandOptionType.Channel, channelTypes: [discord_js_1.ChannelType.GuildCategory], required: true },
        ]
    }, config.guildId);
    app.commands.create({ description: "Close a ticket", name: "close" }, config.guildId);
    app.commands.create({
        description: "Send a message to author of a ticket",
        name: "send",
        options: [
            { description: "Message to send", name: "message", type: discord_js_1.ApplicationCommandOptionType.String, required: true },
            { description: "Is a anonymous message", name: "anonymous", type: discord_js_1.ApplicationCommandOptionType.Boolean }
        ]
    }, config.guildId);
});
exports.event = event;
