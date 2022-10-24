import { ChannelType, Colors } from "discord.js";
import { Event } from "../typings/interfaces";

export const event: Event<"interactionCreate"> = async ({ config, client }, interaction) => {
  if (interaction.isChatInputCommand() && !interaction.user.bot && interaction.guildId == config.guildId) {
    const isTicketChannel = interaction.channel?.type == ChannelType.GuildText && interaction.channel.parentId == interaction.guild?.channels.cache.get(config.categoryId)?.id,
      categoryName = client.guilds.cache.get(config.guildId)?.channels.cache.get(config.categoryId)?.name

    switch (interaction.commandName) {
      case "setup":
        if (interaction.channel?.type == ChannelType.GuildText) {
          if (interaction.guild?.channels.cache.get(config.categoryId)) {
            interaction.reply("Category is already setup")
            return;
          }

          if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has("Administrator")) {
            interaction.reply("You don't have the permissions for doing this")
            return;
          }
        }

        const category = interaction.options.getChannel("category", true)

        if (category.type != ChannelType.GuildCategory) {
          interaction.reply("The channel must be a category")
          return
        }

        config.categoryId = category.id

        interaction.reply("The category has been setup")
        break;
      case "close":
        if (isTicketChannel) {
          interaction.guild?.channels.cache.get(interaction.channelId)?.delete("Ticket closed");
      
          (await client.users.fetch(interaction.channel.name)).send({ embeds: [{
            title: "Ticket closed",
            description: `<@${interaction.user.id}> has closed the ticket.\n \n *We hope the support was useful.*`,
            color: Colors.Red,
            timestamp: new Date().toISOString()
          }] });
        } else interaction.reply(`This command must be used in a channel of category ${categoryName}`)
        break;
      case "send":
        if (isTicketChannel) {    
          const member = interaction.guild?.members.cache.get(interaction.channel.name),
            isAnonymousMessage = interaction.options.getBoolean("anonymous");

          if (!member) {
            interaction.reply("Impossible to send message, seems the user has closed mp's.")
            return;
          }

          interaction.reply("The message has been sent")

          member.send({ embeds: [{
            color: Colors.Green,
            author: {
              name: isAnonymousMessage ? "Anonyme staff" : interaction.user.username,
              icon_url: isAnonymousMessage ? undefined : interaction.user.avatarURL() || undefined
            },
            description: interaction.options.getString("message", true),
            footer: { text: "Support" },
            timestamp: new Date().toISOString()
          }] });
          return;
        } else interaction.reply(`This command must be used in a channel of category ${categoryName}`)
        break;
    }
  }
}