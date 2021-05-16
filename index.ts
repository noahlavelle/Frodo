import Discord = require('discord.js');
import {Guild, Intents, MessageEmbed} from 'discord.js';
import {CommandData, CommandHandlers} from './commandData';
import Enmap = require('enmap');

const client = new Discord.Client({intents: [Intents.ALL]});
export const EmbedColor = '#3498db';

// @ts-ignore
client.settings = new Enmap({
	name: 'settings',
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep',
});

const defaultSettings = {
	prefix: '.',
	joinRole: '',
	jokeFilters: 'nsfw,religious,political,racist,sexist',
};

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

client.on('message', async (message) => {
	// @ts-ignore
	client.settings.ensure(message.guild.id, defaultSettings);
	// @ts-ignore
	if (message.content[0] == client.settings.get(message.guild.id, 'prefix')) {
		await message.reply('', new MessageEmbed()
			.setTitle('Frodo V2:')
			.setDescription('Frodo has updated! We now support slash commands, and werewolf is finally added. There is one step you need to take to use the new version')
			.addField('Add new permission:', 'In order to use the slash commands you need to register the new permission. Just authorise it through this ' +
				'[link](https://discord.com/oauth2/authorize?client_id=836282361657950248&permissions=76880&scope=applications.commands%20bot)')
			.addField('Other features:', 'To use any of the commands, just type / and they should all appear. Also, werewolf has been added!')
			.setColor(EmbedColor));
	}
});

// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logged in'));

export {client};
