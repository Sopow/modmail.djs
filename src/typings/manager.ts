import { TypedEmitter } from "tiny-typed-emitter";
import {
  Client,
  Message,
  MessageEmbed,
  TextChannel,
  MessageButton,
  MessageActionRow,
} from "discord.js";
import { ManagerOptions, Events } from "./interfaces";

export default class Manager extends TypedEmitter<Events> {
  private readonly client: Client;
  private readonly config: ManagerOptions;
  constructor(client: Client, options: ManagerOptions) {
    super();
    if (!client) throw new Error("Client is required");
    if (!options || typeof options !== "object")
      throw new Error("Options are required");
    this.client = client;
    this.config = options;
  }

  private async getChannel(channel: string) {
    const chan = this.client.channels.cache.get(channel) as TextChannel;
    return chan ?? null;
  }

  private async send(content: string, channel: TextChannel) {
    if (!content) throw new Error("Message is required");
    if (!channel) throw new Error("Channel is required");
    const chan = await this.getChannel(channel.id);
    return chan.send({ content: content });
  }

  public async setModmail() {
    this.client.on("messageCreate", async (message: Message) => {
      if (
        message.guild?.id !== this.config.guild &&
        message.content.startsWith(this.config.prefix)
      )
        return;
      if (message.author.bot) return;
      let args = message.content.slice(this.config.prefix.length).split(" ");
      let command = args.shift().toLowerCase();

      switch (command) {
        case "setup":
          const category = message.guild.channels.cache.find(
            (x: { name: string }) => x.name == this.config.category
          );
          const everyone = message.guild.roles.cache.find(
            (x: { name: string }) => x.name == "@everyone"
          );

          if (category) {
            this.send(
              "Category is already setup",
              message.channel as TextChannel
            );
            return;
          }

          if (!message.member?.permissions.has("ADMINISTRATOR")) {
            this.send(
              "You don't have the permissions for doing this",
              message.channel as TextChannel
            );
            return;
          }

          let guild_role = message.guild.roles.cache.get(this.config.role);
          guild_role
            ? guild_role
            : message.guild.roles.create({
                name: "Support",
                color: "BLUE",
                reason: "Support rôle",
              });

          message.guild.channels
            .create(this.config.category, {
              type: "GUILD_CATEGORY",
              topic: "All tickets will be here",
              permissionOverwrites: [
                {
                  id: `${guild_role?.id}`,
                  allow: [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "READ_MESSAGE_HISTORY",
                  ],
                },
                {
                  id: `${everyone?.id}`,
                  deny: [
                    "VIEW_CHANNEL",
                    "SEND_MESSAGES",
                    "READ_MESSAGE_HISTORY",
                  ],
                },
              ],
            })
            .then(() => {
              return message.channel.send("The category has been setup");
            });
          break;
        case "close":
          if (message.type !== "DEFAULT") return;
          if (
            (message.channel as TextChannel)?.parentId !==
            message.guild.channels.cache.find(
              (x: { name: string }) => x.name == this.config.category
            ).id
          )
            return;
          const c = (message.channel as TextChannel).name;
          const channame = await this.getChannel(
            message.guild.channels.cache.find((x: { name: any }) => x.name == c)
              .id
          );
          const user = await this.client.users.fetch(channame.name);

          if (!channame.name) {
            message.channel.send("I can't find the channel, please try again");
            return;
          }

          await message.channel.delete();

          let yembed = new MessageEmbed()
            .setTitle("Ticket closed")
            .setDescription(
              `<@${message.author.id}> has closed the ticket.\n \n *We hope the support was useful.*`
            )
            .setColor("RED")
            .setTimestamp();

          user.send({ embeds: [yembed] });
          break;
      }

      if (message.channel?.type !== "DM") {
        const category = message.guild.channels.cache.find(
          (x: { name: string }) => x.name == this.config.category
        );
        if (!category) return;
        if (
          (message.channel as TextChannel)?.parentId === category.id &&
          message.content.startsWith(this.config.prefix)
        ) {
          if (command) return;
          let member = message.guild.members.cache.get(
            (message.channel as TextChannel).name
          );
          if (!member) {
            this.send(
              "Impossible to send message, seems the user has closed mp's.",
              message.channel as TextChannel
            );
            return;
          }

          let lembed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(
              `${message.content.replace(this.config.prefix, "")}`
            )
            .setFooter({ text: "Support" })
            .setTimestamp();

          message.react("✅");

          member.send({ embeds: [lembed] });
          return;
        }
      } else if (message.channel.type === "DM") {
        const guild = this.client.guilds.cache.get(this.config.guild);
        if (
          !guild ||
          !guild.members.cache.some(
            (x: { id: any }) => x.id === message.author.id
          )
        )
          return;

        const category = guild.channels.cache.find(
          (x: { name: string }) => x.name == this.config.category
        );
        if (!category) return;
        const chan = guild.channels.cache.find(
          (x: { name: any }) => x.name == message.author.id
        );
        if (chan) {
          const xembed = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.avatarURL(),
            })
            .setDescription(message.content)
            .setTimestamp();

          message.react("✅");

          (chan as TextChannel).send({ embeds: [xembed] });
        } else {
          const msgId: string[] = [];
          const buttont = new MessageButton()
            .setEmoji("✅")
            .setCustomId("yes")
            .setStyle("SUCCESS");

          const buttonf = new MessageButton()
            .setEmoji("❌")
            .setCustomId("no")
            .setStyle("DANGER");

          const actionrow = new MessageActionRow().addComponents(
            buttont,
            buttonf
          );
          const confirmation = new MessageEmbed()

            .setTitle("**Confirmation ticket**")
            .setDescription("React for confirm opening a ticket");

          message.channel
            .send({ embeds: [confirmation], components: [actionrow] })
            .then((conf: Message<boolean>) => {
              msgId.push(message.id);

              const collector = conf.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 60000,
              });

              collector.on(
                "collect",
                async (i: {
                  customId: any;
                  reply: (arg0: { embeds: any[]; ephemeral: boolean }) => void;
                }) => {
                  switch (i.customId) {
                    case "yes":
                      let sembed = new MessageEmbed()
                        .setTitle("Ticket opened")
                        .setColor("GREEN")
                        .setDescription(
                          "A ticket has been opened for you, please wait for a staff member to respond."
                        )
                        .setFooter({
                          text: `Your ticket has been opened`,
                        })
                        .setTimestamp();

                      message.react("✅");
                      i.reply({ embeds: [sembed], ephemeral: true });
                      collector.stop();

                      const createticket = await guild.channels.create(
                        message.author.id,
                        {
                          type: "GUILD_TEXT",
                          parent: category.id,
                          topic:
                            "This ticket was opened by **" +
                            message.author.tag +
                            `**. Do **${this.config.prefix} <message>** for respond.`,
                        }
                      );

                      const date = message.author.createdAt;
                      const localDate = date.toLocaleDateString();
                      const server = this.client.guilds.cache.get(
                        this.config.prefix
                      );
                      const rolesupp = server?.roles.cache.find(
                        (r: { id: string }) => r.id === this.config.role
                      );

                      let eembed = new MessageEmbed()
                        .setAuthor({
                          name: message.author.username,
                          iconURL: message.author.avatarURL(),
                        })
                        .setColor("BLUE")
                        .setThumbnail(
                          message.author.displayAvatarURL({
                            dynamic: true,
                          })
                        )
                        .setDescription(`**Message**\n${message.content}\n\n`)
                        .addField(
                          "Account's creation date",
                          `\`${localDate}\``
                        );

                      createticket.send({
                        content: `There is a new ticket ${
                          rolesupp ? rolesupp : "@everyone"
                        } !`,
                        embeds: [eembed],
                      });
                      break;
                    case "no":
                      message.react("❌");
                      let rembed = new MessageEmbed()
                        .setTitle("Ticket closed")
                        .setColor("RED")
                        .setDescription("Your ticket was not opened")
                        .setFooter({
                          text: `Your ticket is not opened`,
                        })
                        .setTimestamp();

                      collector.stop();
                      i.reply({ embeds: [rembed], ephemeral: true });
                      break;
                    default:
                      break;
                  }
                }
              );
            });
        }
      }
    });
    this.emit("ready");
  }
}