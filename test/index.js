const { Manager } = require('modmail.djs');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
    intents: Object.keys(GatewayIntentBits), // all intents
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const manager = new Manager(client, {
    guildId: '',
    categoryId: '',
    role: ''
});

client.once('ready', () => {
    console.log('Ready!');
    manager.setModmail();
})

client.login('');
