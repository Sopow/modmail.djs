import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Event } from "../typings/interfaces";

export const event: Event<"ready"> = ({ config }, client) => client.application?.fetch().then(app => {
  app.commands.create({
    description: "Setup the category of modmail system",
    name: "setup",
    options: [
      { description: "Category name", name: "category", type: ApplicationCommandOptionType.Channel, channelTypes: [ChannelType.GuildCategory], required: true },
    ]
  }, config.guildId)

  app.commands.create({ description: "Close a ticket", name: "close" }, config.guildId)

  app.commands.create({
    description: "Send a message to author of a ticket",
    name: "send",
    options: [
      { description: "Message to send", name: "message", type: ApplicationCommandOptionType.String, required: true },
      { description: "Is a anonymous message", name: "anonymous", type: ApplicationCommandOptionType.Boolean }
    ]
  }, config.guildId)
})