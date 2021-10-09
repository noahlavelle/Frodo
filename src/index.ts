import Discord = require('discord.js');
import {Intents, MessageEmbed} from 'discord.js';
import {CommandData} from './resetCommands';
import AutoPoster from 'topgg-autoposter';
import {hasVoted, setVoteEvent} from './votes';

hasVoted(0);

// @ts-ignore
const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});
export const EmbedColor = '#3498db';
export const timestamp = Date.now();
const stats = {
	'trivia': 0,
};

if (process.env.RUNTIME) {
	// eslint-disable-next-line new-cap
	const topgg = AutoPoster(process.env.TOPGGTOKEN, client);
	topgg.on('posted', () => {
		console.log('Stats posted to Top.gg');
	});
}

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

const votingEmbed = new MessageEmbed()
	.setTitle('Thanks for voting for Frodo!')
	.setColor(EmbedColor)
	.setDescription('Voting for Frodo helps us out greatly and if you would like to further support us, be sure to vote for us everyday!')
	.addFields([
		{
			name: 'Want to add Frodo to your own server?',
			value: 'https://invite.frodo.fun',
			inline: true,
		},
		{
			name: 'Want to vote again?',
			value: 'https://top.gg/bot/734746193082581084/vote',
			inline: true,
		},
	]);

client.once('ready', async () => {
	setVoteEvent(async (id) => {
		try {
			await (await client.users.fetch(id)).send({embeds: [votingEmbed]});
		} catch (err) {}
	});

	statusRotation([
		['Trivia Leaderboard!'],
		['/leaderboard'],
		[() => `${client.guilds.cache.size} servers!`, 'WATCHING'],
	], 10000);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	if (Object.keys(CommandData).includes(`${interaction.commandName}CommandData`)) {
		if (!interaction.guild) {
			return interaction.reply({
				content: 'This command is not available in DMs, please try again in a server',
				ephemeral: true,
			}).catch(() => {});
		}

		try {
			CommandData[`${interaction.commandName}CommandData`].execute(interaction);
			stats[interaction.commandName] ? stats[interaction.commandName]++ : stats[interaction.commandName] = 1;
		} catch (e) {
			await interaction.followUp( {
				embeds: [
					new MessageEmbed()
						.setTitle('Something has gone wrong :confused:')
						.setColor('#B00020'),
				],
			}).catch(() => {});

			console.error(e);
		}
	} else {
		return interaction.reply({
			content: 'Looks like we can\'t find that command! We are most likely updating Frodo so please try again later',
			ephemeral: true,
		}).catch(() => {});
	}
});

client.on('guildCreate', async (guild) => {
	const text = `Joined new guild: ${guild.name} which has ${guild.memberCount} members. I'm now in ${client.guilds.cache.size} guilds!`;
	try {
		(await client.users.fetch('359367096150261770')).send(text);
		(await client.users.fetch('315399139783344128')).send(text);
	} catch (err) {}
});

const helpEmbed = (auth) => {
	return new MessageEmbed()
		.setColor(EmbedColor)
		.setTitle('Frodo V2 is here!')
		.setDescription('Frodo has updated! We now use slash commands, all commands have been revamped and many bugs have been fixed and we have a new command, othello (werewolf is still in development)! But there\'s one step you need to take to use the new version.')
		.addField('New Permissions:', auth ? (
			`You don't need to do anything! Just type \`/\` and pick from out large choice of commands`
		) : (
			`In order to use slash commands, you need to give Frodo new permissions. Someone from this server with the \`Manage Server\` permission can authorise it at https://slash.frodo.fun`
		))
		.addField('How to use new commands:', 'Once Frodo has been given the new permissions, type `/` to view its commands!')
		.addField('Not Working?', 'Let us know at our [feedback page](https://frodo.fun/feedback) and we will be in contact to fix your issue!');
};
client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.content.startsWith('.') || message.content.includes(client.user.id)) {
		let auth = true;
		try {
			await message.guild.commands.fetch();
		} catch (err) {
			auth = false;
		}
		if (message.content.includes(`${client.user.id}`) || (message.content.startsWith('.') && !auth)) {
			await message.reply({embeds: [helpEmbed(auth)]}).catch(() => {});
		}
	}
	if ((message.author.id === '359367096150261770' || message.author.id === '315399139783344128') && message.content === '!stats') {
		const statsMessage = Object.keys(stats).map((command) => `${command}: ${stats[command]}`).join('\n');
		message.reply(statsMessage);
	}
});

// login to Discord with your app's token
client.login(process.env.TOKEN || require('./config.json').token).then(() => console.log('Logged in'));

export {client};
