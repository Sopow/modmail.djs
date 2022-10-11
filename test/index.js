const { Manager } = require("modmail.djs");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
  intents: Object.keys(GatewayIntentBits),
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
  console.log("Ready!");
  new Manager(client, { guildId: "", categoryId: "", role: "" }).setModmail();
});

client.login("");
