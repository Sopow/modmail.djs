# Modmail.DJS

Modmail.djs is a powerful Node.js module for Discord.js that allows you to create a modmail bot with one function.

## Installation
```console
npm i modmail.djs
```
## Example
```JS
const { Manager } = require('modmail.djs');
const { Client } = require('discord.js')

const client = new Client({
    intents: 131071, // all intents
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

const manager = new Manager(client, {
    guildId: '',
    categoryId: '',
    role: ''
})

client.on('ready', () => {
    console.log('Ready!')
    manager.setModmail();
})

client.login('')
```

#### ES6 :
```JS
import { Manager } from 'modmail.djs';
import { Client } from 'discord.js'

const client = new Client({
    intents: 131071, // all intents
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

const manager = new Manager(client, {
    guildId: '',
    categoryId: '',
    role: ''
})

client.on('ready', () => {
    console.log('Ready!')
    manager.setModmail();
})

client.login('')
```