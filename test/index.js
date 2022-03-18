const { Manager } = require('modmail.djs');
const { Client } = require('discord.js')

const client = new Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

const manager = new Manager(client, {
    guild: '',
    category: '',
    prefix: '',
    role: ''
})

client.on('ready', () => {
    console.log('Ready!')
    manager.setModmail();
})

client.login('')