import { TypedEmitter } from "tiny-typed-emitter";
import { Client, Message, TextChannel, ChannelType, ComponentType, MessageType, Colors, ButtonStyle } from "discord.js";
import { ManagerOptions, Events } from "./interfaces";

export default class Manager extends TypedEmitter<Events> {
  private readonly client: Client;
  private readonly config: ManagerOptions;
  constructor(client: Client, options: ManagerOptions) {
    super();

    if (!client) throw new Error("Client is required");
    if (!options || typeof options !== "object") throw new Error("Options are required");

    this.client = client;
    this.config = options;
  }

  private async send(content: string, channel: TextChannel) {
    if (!content) throw new Error("Message is required");
    if (!channel) throw new Error("Channel is required");

    return channel.send({ content: content });
  }

  public async setModmail() {
    this.client.on("messageCreate", async (message: Message) => {
      if (message.guild?.id !== this.config.guild && message.content.startsWith(this.config.prefix)) return;
      if (message.author.bot) return;

      const command = message.content.slice(this.config.prefix.length).split(" ").shift().toLowerCase();

      switch (command) {
        case "setup":
          const category = message.guild.channels.cache.find(x => x.name == this.config.category);

          if (category) {
            this.send("Category is already setup", message.channel as TextChannel);
            return;
          }

          if (!message.member?.permissions.has("Administrator")) {
            this.send("You don't have the permissions for doing this", message.channel as TextChannel);
            return;
          }

          message.guild.channels.create({
            name: this.config.category,
            type: ChannelType.GuildCategory,
            topic: "All tickets will be here",
            permissionOverwrites: [
              {
                id: (message.guild.roles.cache.get(this.config.role) || await message.guild.roles.create({
                  name: "Support", color: "Blue", reason: "Support rôle"
                })).id,
                allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
              },
              { id: message.guild.id, deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
            ],
          }).then(() => message.channel.send("The category has been setup"));
          break;
        case "close":
          if (message.type !== MessageType.Default) return;
          if ((message.channel as TextChannel).parentId !== message.guild.channels.cache.find(x => x.name == this.config.category).id) return;

          const channel = message.channel as TextChannel, user = await this.client.users.fetch(channel.name);

          if (!channel.name) {
            message.channel.send("I can't find the channel, please try again");
            return;
          }

          await message.channel.delete();

          user.send({ embeds: [{
            title: "Ticket closed",
            description: `<@${message.author.id}> has closed the ticket.\n \n *We hope the support was useful.*`,
            color: Colors.Red,
            timestamp: new Date().toISOString()
          }] });
          break;
      }

      if (message.channel?.type !== ChannelType.DM) {
        const category = message.guild.channels.cache.find(x => x.name == this.config.category);

        if (!category) return;
        if ((message.channel as TextChannel)?.parentId === category.id && message.content.startsWith(this.config.prefix)) {
          if (command) return;

          const member = message.guild.members.cache.get(message.channel.name);

          if (!member) {
            this.send("Impossible to send message, seems the user has closed mp's.", message.channel as TextChannel);
            return;
          }

          message.react("✅");

          member.send({ embeds: [{
            color: Colors.Green,
            author: { name: message.author.username, icon_url: message.author.avatarURL() },
            description: `${message.content.replace(this.config.prefix, "")}`,
            footer: { text: "Support" },
            timestamp: new Date().toISOString()
          }] });
          return;
        }
      } else if (message.channel.type === ChannelType.DM) {
        const guild = this.client.guilds.cache.get(this.config.guild);

        if (!guild?.members.cache.some(x => x.id === message.author.id)) return;

        const category = guild.channels.cache.find(x => x.name == this.config.category);

        if (!category) return;

        const channel = guild.channels.cache.find(x => x.name == message.author.id);

        if (channel) {
          message.react("✅");

          (channel as TextChannel).send({ embeds: [{
            color: Colors.Yellow,
            author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
            description: message.content,
            timestamp: new Date().toISOString()
          }] });
        } else message.channel.send({
          embeds: [{ title: "**Confirmation ticket**", description: "React for confirm opening a ticket" }],
          components: [{
            type: ComponentType.ActionRow,
            components: [
              { type: ComponentType.Button, style: ButtonStyle.Success, customId: "yes", emoji: "✅" },
              { type: ComponentType.Button, style: ButtonStyle.Danger, customId: "no", emoji: "❌" }
            ]
          }]
        }).then(message => {
          const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

          collector.on("collect", async interaction => {
            switch (interaction.customId) {
              case "yes":
                message.react("✅");

                interaction.reply({
                  embeds: [{
                    title: "Ticker opened",
                    color: Colors.Green,
                    description: "A ticket has been opened for you, please wait for a staff member to respond.",
                    footer: { text: "Your ticket has been opened" },
                    timestamp: new Date().toISOString()
                  }],
                  ephemeral: true
                });

                collector.stop();

                guild.channels.create({
                  name: message.author.id,
                  type: ChannelType.GuildText,
                  parent: category.id,
                  topic: `This ticket was opened by **${message.author.tag}**. Do **${this.config.prefix} <message>** for respond.`,
                }).then(channel => channel.send({
                  content: `There is a new ticket ${this.client.guilds.cache.get(this.config.prefix).roles.cache.find(r => r.id === this.config.role) || "@everyone"} !`,
                  embeds: [{
                    author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                    color: Colors.Blue,
                    description: `**Message**\n${message.content}\n\n`,
                    thumbnail: { url: message.author.displayAvatarURL() },
                    fields: [{ name: "Account's creation date", value: `\`${message.author.createdAt.toLocaleDateString()}\`` }]
                  }],
                }))
                break;
              case "no":
                message.react("❌");

                collector.stop();
  
                interaction.reply({
                  embeds: [{
                    title: "Ticket closed",
                    color: Colors.Red,
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

    this.emit("ready");
  }
}