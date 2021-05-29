import Discord = require('discord.js');
import {Guild, Intents} from 'discord.js';
import {CommandData, CommandHandlers} from './commandData';

// @ts-ignore
const client = new Discord.Client({intents: [Intents.ALL]});
export const EmbedColor = '#3498db';


client.once('ready', async () => {
	for (const key of Object.keys(CommandData)) { // @ts-ignore
		await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData[key]);
	}
	console.log('Ready');
});

client.on('interaction', async (interaction) => {
	if (!interaction.isCommand()) return;
	CommandHandlers[interaction.commandName](interaction);
});

// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logged in'));

export {client};
