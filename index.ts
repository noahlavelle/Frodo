import Discord = require('discord.js');
import {Intents} from 'discord.js';
import {CommandData, CommandHandlers} from './commandData';

const client = new Discord.Client({intents: [Intents.ALL]});
export const EmbedColor = '#3498db';


client.once('ready', async () => {
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.connectFourCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.rpsCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.akinatorCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.anagramsCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.tttCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.hangmanCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.werewolfCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.factCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.fortuneCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.jokeCommandData);
	// await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.insultCommandData);
	console.log('Ready');
});

client.on('interaction', async (interaction) => {
	if (!interaction.isCommand()) return;
	CommandHandlers[interaction.commandName](interaction);
});

// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logged in'));

export {client};
