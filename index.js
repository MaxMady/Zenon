const { Client, Collection, EmbedBuilder, WebhookClient } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.js')
const wait = require('node:timers/promises').setTimeout;
const { QuickDB } = require('quick.db');

(global.db) = new QuickDB({filePath: `./data/data.sqlite`});
(global.balls) = new QuickDB({filePath: `./data/balls.sqlite`});
const client = (global.client = new Client({
	intents: 40827,
	allowedMentions: { parse: ['users'] },
	partials: ['CHANNEL'],
}));

global.messageCounter = new Map();

client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const commandsPath = path.join(__dirname, 'commands');

//Slash command handler
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a requi#FF0000 "data" or "execute" property.`);
	}
}

//Event handler
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const errorLogger = new WebhookClient({
    url: config.errorPayLoad,
})
process.on('unhandledRejection', (reason, p) => {
if (reason?.message === 'The request is missing a valid API key.') return;
console.log(reason, p);
errorLogger?.send({
embeds: [
    new EmbedBuilder()
        .setTitle('Unhandled Rejection')
        .setDescription(`${reason}`)
        .setColor('#FF0000')
        .setFields([{name: `Stack`, value: '```js\n' + reason.stack + '```'}])
],
});
});
process.on('uncaughtException', (err, origin) => {
console.log(err, origin);
errorLogger?.send({
embeds: [
    new EmbedBuilder()
        .setTitle('Uncaught Exception')
        .setDescription(`${err}`)
        .setColor('#FF0000')
        .setFields([{name: `Stack`, value: '```js\n' + err.stack + '```'}])
],
});
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
console.log(err, origin);
errorLogger?.send({
embeds: [
    new EmbedBuilder()
        .setTitle('Uncaught Exception')
        .setDescription(`${err}`)
        .setColor('#FF0000')
        .setFields([{name: `Stack`, value: '```js\n' + err.stack + '```'}])
],
});
});
process.on('multipleResolves', (type, promise, reason) => {
    if(!reason) return
console.log(type, promise, reason);
errorLogger?.send({
embeds: [
    new EmbedBuilder()
        .setTitle('Multiple Resolves')
        .setDescription(`${type}`)
        .setColor('#FF0000')
        .setFields([{name: `Stack`, value: '```js\n' + reason + '```'}])
],
});
});


client.login(config.token)