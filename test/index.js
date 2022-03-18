const {
    Manager
} = require('../lib/src/');
const {
    Client
} = require('discord.js')

const client = new Client({
    intents: 32767,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
const manager = new Manager(client, {
    guild: '925331433831170058',
    category: 'Tickets',
    prefix: '!',
    role: '928588994512572496'
})

client.on('ready', () => {
    console.log('Ready!')
    manager.setModmail();
})

client.login('OTM2MzM3NzQ5MzUzNTk0OTIw.YfLuew.8o0kULZ0lf9FTueKvdIkPpUoGHs')