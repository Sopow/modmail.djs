# modmail.djs

modmail.djs is a powerful Node.js module for discord.js that allows you to create a modmail bot with one function.

## Installation
```console
npm i modmail.djs@latest
```
## Example
```JS
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
```

#### ES6 :
```JS
import { Manager } from 'modmail.djs';
import { Client, GatewayIntentBits, Partials } from 'discord.js';

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
});

client.login('');
```
