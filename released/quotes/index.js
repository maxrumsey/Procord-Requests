const commando = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
let db = require('./mysqldb.js');

const client = new commando.Client({
	owner: ['213928278497558528', config.owner],
	commandPrefix: '%'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })

client.registry
	.registerGroups([
    ['quote', 'Quoting Commands'],
    ['role', 'Roling Commands']
  ])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);
