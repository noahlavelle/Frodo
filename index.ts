import Discord = require('discord.js');
import {Intents} from 'discord.js';
import {CommandData, CommandHandlers} from './commandData';

const client = new Discord.Client({intents: [Intents.ALL]});


client.once('ready', async () => {
	await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.connectFourCommandData);
	await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.rpsCommandData);
	await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.akinatorCommandData);
	await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.countdownCommandData);

	console.log('Ready');
});

client.on('interaction', async (interaction) => {
	if (!interaction.isCommand()) return;
	CommandHandlers[interaction.commandName](interaction);
});

// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logging in'));

export {client};
