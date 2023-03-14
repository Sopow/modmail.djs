<div align="center">
	<br />
	<p>
		<a href="https://www.npmjs.com/package/modmail.djs"><img src="https://img.shields.io/npm/v/modmail.djs.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/modmail.djs"><img src="https://img.shields.io/npm/dt/modmail.djs.svg?maxAge=3600" alt="npm downloads" /></a>
	</p>
</div>

# modmail.djs

A powerful Node.js module for discord.js that allows you to create a modmail bot with one function.

## Installation
```console
npm install modmail.djs
```
## Example

#### CJS:
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
});

client.login('');
```

#### ESM:
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
