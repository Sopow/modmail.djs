const { Manager } = require("modmail.djs");
const { Client, Partials } = require("discord.js")

const client = new Client({ intents: 131071, partials: [Partials.Message, Partials.Channel, Partials.Reaction] })

client.on("ready", () => {
  console.log("Ready!")
  new Manager(client, { guild: "", category: "", prefix: "", role: "" }).setModmail();
})

client.login("")