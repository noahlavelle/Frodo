import Discord = require('discord.js');
import {Intents, MessageEmbed} from 'discord.js';
import {CommandData} from './resetCommands';

// @ts-ignore
const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});
export const EmbedColor = '#3498db';
export const timestamp = Date.now();

function statusRotation(statuses, speed) {
	let current = 0;
	setInterval(() => {
		const activity = statuses[current];
		if (typeof(activity[0]) === 'function') activity[0] = activity[0]();
		client.user.setActivity(activity[0], {type: activity[1] || 'PLAYING'});
		current++;
		current %= statuses.length;
	}, speed);
};

client.once('ready', async () => {
	statusRotation([
		['Frodo V2 is here!'],
		['Type @Frodo'],
		[() => `${client.guilds.cache.size} servers!`, 'WATCHING'],
	], 10000);
});


client.on('interactionCreate', (interaction) => {
	if (!interaction.isCommand()) return;
	if (Object.keys(CommandData).includes(`${interaction.commandName}CommandData`)) {
		if (!interaction.guild) {
			return interaction.reply('This command is not available in DMs, please try again in a server');
		}

		try {
			CommandData[`${interaction.commandName}CommandData`].execute(interaction);
		} catch (e) {
			console.error(e);
		}
	}
});

const helpEmbed = (auth) => {
	return new MessageEmbed()
		.setColor(EmbedColor)
		.setTitle('Frodo V2 is here!')
		.setDescription('Frodo has updated! We now use slash commands, all commands have been revamped and many bugs have been fixed and we have a new command, othello (werewolf is still in development)! But there\'s one step you need to take to use the new version.')
		.addField('New Permissions:', `In order to use slash commands, you need to give Frodo new permissions. Someone from this server with the \`Manage Server\` permission can authorise it at https://slash.frodo.fun\nThis server currently has slash commands ${auth ? '`Enabled`' : '`Disabled`'} for Frodo.`)
		.addField('How to use new commands:', 'Once Frodo has been given the new permissions, type `/` to view its commands!')
		.addField('Not Working?', 'Let us know at our [feedback page](https://frodo.fun/feedback) and we will be in contact to fix your issue!');
};
client.on('messageCreate', async (message) => {
	if (message.content.startsWith('.') || message.content.includes(client.user.id)) {
		let auth = true;
		try {
			await message.guild.commands.fetch();
		} catch (err) {
			auth = false;
		};
		if (message.content.includes(`${client.user.id}`) || (message.content.startsWith('.') && !auth)) {
			await message.reply({embeds: [helpEmbed(auth)]});
		};
	};
});

// login to Discord with your app's token
client.login(process.env.TOKEN || require('./config.json').token).then(() => console.log('Logged in'));

export {client};