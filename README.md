<div align="center">
	<br />
	<p>
		<a href="https://discord.gg/ccfGcFJTVb"><img src="https://img.shields.io/discord/982404807786655755?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/modmail.djs"><img src="https://img.shields.io/npm/v/modmail.djs.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/modmail.djs"><img src="https://img.shields.io/npm/dt/modmail.djs.svg?maxAge=3600" alt="npm downloads" /></a>
	</p>
</div>

# modmail.djs

modmail.djs is a powerful Node.js module for discord.js that allows you to create a modmail bot with one function.

## Installation
```console
npm i modmail.djs@latest
```
## Example

#### CommonJS:
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

#### ES6:
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

## Help
If you don't understand something in the documentation, you are experiencing problems, or you just need a gentle nudge in the right direction, please don't hesitate to join our [server](https://discord.gg/ccfGcFJTVb).
