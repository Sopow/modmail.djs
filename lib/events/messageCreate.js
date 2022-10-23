"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const discord_js_1 = require("discord.js");
const event = ({ client, config }, message) => {
    if (message.channel.type === discord_js_1.ChannelType.DM && !message.author.bot) {
        const guild = client.guilds.cache.get(config.guildId);
        if (!guild?.members.cache.has(message.author.id))
            return;
        const category = guild.channels.cache.get(config.categoryId);
        if (!category)
            return;
        const channel = guild.channels.cache.find(channel => channel.name == message.author.id);
        if (channel?.type == discord_js_1.ChannelType.GuildText)
            channel.send({
                embeds: [{
                        color: discord_js_1.Colors.Yellow,
                        author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                        description: message.content,
                        timestamp: new Date().toISOString()
                    }],
                files: message.attachments.toJSON()
            }).then(() => message.react("✅"));
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
                            message.react("✅");
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
                                content: `There is a new ticket ${client.guilds.cache.get(config.guildId)?.roles.cache.get(config.role) || "@everyone"} !`,
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
                            message.react("❌");
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
};
exports.event = event;
