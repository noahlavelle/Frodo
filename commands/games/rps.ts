import {CommandInteraction, Message, MessageEmbed, User} from 'discord.js';
import {client, EmbedColor} from '../../index';
import {getMessage, removeReaction} from './utils';

enum WinScenario {
	Tie,
	PlayerOne,
	PlayerTwo,
}

const WinScenarios = {
	'rpsrrpss': WinScenario.PlayerOne,
	'rpsprpsr': WinScenario.PlayerOne,
	'rpssrpsp': WinScenario.PlayerOne,

	'rpssrpsr': WinScenario.PlayerTwo,
	'rpsrrpsp': WinScenario.PlayerTwo,
	'rpsprpss': WinScenario.PlayerTwo,

	'rpsrrpsr': WinScenario.Tie,
	'rpsprpsp': WinScenario.Tie,
	'rpssrpss': WinScenario.Tie,
};

const LetterReactions = [
	'856205202994626580',
	'856205203011272715',
	'856205203128582214',
];
const LetterReactionsFilter = [
	'rpsr',
	'rpsp',
	'rpss',
];

function embed(text, color?) {
	return new MessageEmbed()
		.setColor(color || EmbedColor)
		.setDescription(text);
};

export class Rps {
	interaction : CommandInteraction;
	players : User[];
	message : Message;

	constructor(interaction : CommandInteraction) {
		this.interaction = interaction;
		this.players = [interaction.user, interaction.options.getUser('playertwo')];
		this.runGame();
	}

	async runGame() {
		try {
			if (this.players[1] == null || this.players[1].bot) return this.interaction.reply('The player could not be found or was a bot');

			await this.interaction.reply({embeds: [embed(`${this.players[0]} has challenged ${this.players[1]} to a game of rock paper scissors.\nPlease move to DMs`)]});
			this.message = await getMessage(this.interaction);

			const playerOneMessage = await this.players[0].send({
				embeds: [
					embed(`You challenged ${this.players[1].username} to Rock Paper Scissors [here](https://discordapp.com/channels/${this.message.guild.id}/${this.message.channel.id}/${this.message.id})\nChoose rock, paper or scissors`),
				],
			});
			const playerTwoMessage = await this.players[1].send({
				embeds: [
					embed(`${this.players[0].username} challenged you to Rock Paper Scissors [here](https://discordapp.com/channels/${this.message.guild.id}/${this.message.channel.id}/${this.message.id})\nChoose rock, paper or scissors`),
				],
			});

			for (const letter of LetterReactions) {
				await Promise.all([playerOneMessage.react(letter), playerTwoMessage.react(letter)]);
			}

			const filter = (reaction) => LetterReactionsFilter.includes(reaction.emoji.name);
			playerOneMessage.awaitReactions({
				filter,
				max: 1,
				time: 300000,
				errors: ['time'],
			}).then(() => removeReaction(playerOneMessage, this.message.author));
			playerTwoMessage.awaitReactions({
				filter,
				max: 1,
				time: 300000,
				errors: ['time'],
			}).then(() => removeReaction(playerTwoMessage, this.message.author));

			const playerOneAwait = playerOneMessage.awaitReactions({filter, max: 1, time: 300000, errors: ['time']});
			const playerTwoAwait = playerTwoMessage.awaitReactions({filter, max: 1, time: 300000, errors: ['time']});

			await Promise.all([playerOneAwait, playerTwoAwait]).then((values) => {
				const winScenario = WinScenarios[values[0].first().emoji.name + values[1].first().emoji.name];
				this.message.edit({embeds: [embed(`${winScenario === WinScenario.PlayerOne ? this.players[0] : this.players[1]} has ${winScenario == WinScenario.Tie ? 'tied with' : 'beaten'} ${winScenario == WinScenario.PlayerOne ? this.players[1] : this.players[0]} at a game of rock paper scissors`)]});
				if (winScenario === WinScenario.PlayerOne) {
					playerOneMessage.edit({embeds: [embed(`You beat ${this.players[1].username}`)]});
					playerTwoMessage.edit({embeds: [embed(`${this.players[0].username} beat you!`)]});
				} else if (winScenario === WinScenario.PlayerTwo) {
					playerOneMessage.edit({embeds: [embed(`${this.players[1].username} beat you!`)]});
					playerTwoMessage.edit({embeds: [embed(`You beat ${this.players[0].username}`)]});
				} else {
					playerOneMessage.edit({embeds: [embed(`You drew against ${this.players[1].username}!`)]});
					playerTwoMessage.edit({embeds: [embed(`You drew against ${this.players[0].username}!`)]});
				}
				;
			});
		} catch (err) {
			return this.message.edit({embeds: [embed('The game has timed out!', '#ff0000')]});
		};
	}
}
