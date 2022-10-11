"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const discord_js_1 = require("discord.js");
class Manager extends events_1.EventEmitter {
    constructor(client, options) {
        super();
        if (!client)
            throw new Error("Client is required");
        if (!options || typeof options !== "object")
            throw new Error("Options are required");
        client.on("ready", client => {
            client.application?.fetch().then(app => {
                app.commands.create({
                    description: "Setup the category of modmail system",
                    name: "setup",
                    options: [
                        { description: "Category name", name: "category", type: discord_js_1.ApplicationCommandOptionType.Channel, required: true },
                    ]
                }, options.guildId);
                app.commands.create({ description: "Close a ticket", name: "close" }, options.guildId);
                app.commands.create({
                    description: "Send a message to author of a ticket",
                    name: "send",
                    options: [
                        { description: "Message to send", name: "message", type: discord_js_1.ApplicationCommandOptionType.String, required: true },
                        { description: "Is a anonymous message", name: "anonymous", type: discord_js_1.ApplicationCommandOptionType.Boolean }
                    ]
                }, options.guildId);
            });
        });
        this.client = client;
        this.config = options;
    }
    client;
    config;
    setModmail() {
        this.client.on("messageCreate", message => {
            if (message.channel.type === discord_js_1.ChannelType.DM && !message.author.bot) {
                const guild = this.client.guilds.cache.get(this.config.guildId);
                if (!guild?.members.cache.has(message.author.id))
                    return;
                const category = guild.channels.cache.get(this.config.categoryId);
                if (!category)
                    return;
                const channel = guild.channels.cache.find(channel => channel.name == message.author.id);
                if (channel?.type == discord_js_1.ChannelType.GuildText)
                    channel.send({ embeds: [{
                                color: discord_js_1.Colors.Yellow,
                                author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                                description: message.content,
                                timestamp: new Date().toISOString()
                            }] }).then(() => message.react("✅"));
                else
                    message.channel.send({
                        embeds: [{ title: "**Confirmation ticket**", description: "React for confirm opening a ticket" }],
                        components: [{
                                type: discord_js_1.ComponentType.ActionRow,
                                components: [
                                    { type: discord_js_1.ComponentType.Button, style: discord_js_1.ButtonStyle.Success, customId: "yes", emoji: "✅" },
                                    { type: discord_js_1.ComponentType.Button, style: discord_js_1.ButtonStyle.Danger, customId: "no", emoji: "❌" }
                                ]
                            }]
                    }).then(msg => {
                        const collector = msg.createMessageComponentCollector({ componentType: discord_js_1.ComponentType.Button, time: 60000 });
                        collector.on("collect", interaction => {
                            switch (interaction.customId) {
                                case "yes":
                                    msg.react("✅");
                                    interaction.reply({
                                        embeds: [{
                                                title: "Ticker opened",
                                                color: discord_js_1.Colors.Green,
                                                description: "A ticket has been opened for you, please wait for a staff member to respond.",
                                                footer: { text: "Your ticket has been opened" },
                                                timestamp: new Date().toISOString()
                                            }],
                                        ephemeral: true
                                    });
                                    collector.stop();
                                    guild.channels.create({
                                        name: message.author.id,
                                        type: discord_js_1.ChannelType.GuildText,
                                        parent: category.id,
                                        topic: `This ticket was opened by **${message.author.tag}**. Do use **/send** for respond.`,
                                    }).then(channel => channel.send({
                                        content: `There is a new ticket ${this.client.guilds.cache.get(this.config.guildId)?.roles.cache.get(this.config.role) || "@everyone"} !`,
                                        embeds: [{
                                                author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                                                color: discord_js_1.Colors.Blue,
                                                description: `**Message**\n${message.content}\n\n`,
                                                thumbnail: { url: message.author.displayAvatarURL() },
                                                fields: [{ name: "Account's creation date", value: `\`${message.author.createdAt.toLocaleDateString()}\`` }]
                                            }],
                                    }));
                                    break;
                                case "no":
                                    msg.react("❌");
                                    collector.stop();
                                    interaction.reply({
                                        embeds: [{
                                                title: "Ticket closed",
                                                color: discord_js_1.Colors.Red,
                                                description: "Your ticket was not opened",
                                                footer: { text: `Your ticket is not opened` },
                                                timestamp: new Date().toISOString()
                                            }],
                                        ephemeral: true
                                    });
                                    break;
                            }
                        });
                    });
            }
        });
        this.client.on("interactionCreate", async (interaction) => {
            if (interaction.isChatInputCommand() && !interaction.user.bot && interaction.guildId == this.config.guildId) {
                const isTicketChannel = interaction.channel?.type == discord_js_1.ChannelType.GuildText && interaction.channel.parentId == interaction.guild?.channels.cache.get(this.config.categoryId)?.id, categoryName = this.client.guilds.cache.get(this.config.guildId)?.channels.cache.get(this.config.categoryId)?.name;
                switch (interaction.commandName) {
                    case "setup":
                        if (interaction.channel?.type == discord_js_1.ChannelType.GuildText) {
                            if (interaction.guild?.channels.cache.get(this.config.categoryId)) {
                                interaction.reply("Category is already setup");
                                return;
                            }
                            if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("Administrator")) {
                                interaction.reply("You don't have the permissions for doing this");
                                return;
                            }
                        }
                        const category = interaction.options.getChannel("category", true);
                        if (category.type != discord_js_1.ChannelType.GuildCategory) {
                            interaction.reply("The channel must be a category");
                            return;
                        }
                        this.config.categoryId = category.id;
                        interaction.reply("The category has been setup");
                        break;
                    case "close":
                        if (isTicketChannel) {
                            interaction.guild?.channels.cache.get(interaction.channelId)?.delete("Ticket closed");
                            (await this.client.users.fetch(interaction.channel.name)).send({ embeds: [{
                                        title: "Ticket closed",
                                        description: `<@${interaction.user.id}> has closed the ticket.\n \n *We hope the support was useful.*`,
                                        color: discord_js_1.Colors.Red,
                                        timestamp: new Date().toISOString()
                                    }] });
                        }
                        else
                            interaction.reply(`This command must be used in a channel of category ${categoryName}`);
                        break;
                    case "send":
                        if (isTicketChannel) {
                            const member = interaction.guild?.members.cache.get(interaction.channel.name), isAnonymousMessage = interaction.options.getBoolean("anonymous");
                            if (!member) {
                                interaction.reply("Impossible to send message, seems the user has closed mp's.");
                                return;
                            }
                            interaction.reply("The message has been sent");
                            member.send({ embeds: [{
                                        color: discord_js_1.Colors.Green,
                                        author: {
                                            name: isAnonymousMessage ? "Anonyme staff" : interaction.user.username,
                                            icon_url: isAnonymousMessage ? undefined : interaction.user.avatarURL() || undefined
                                        },
                                        description: interaction.options.getString("message", true),
                                        footer: { text: "Support" },
                                        timestamp: new Date().toISOString()
                                    }] });
                            return;
                        }
                        else
                            interaction.reply(`This command must be used in a channel of category ${categoryName}`);
                        break;
                }
            }
        });
        this.emit("ready");
    }
}
exports.default = Manager;
