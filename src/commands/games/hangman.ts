import {Channel, CommandInteraction, Message, MessageEmbed, TextChannel, User} from 'discord.js';
import handleError, {DmMessageHandler, getMessage, MessageHandler} from '../../utils';

const HangmanStages = [
	'___\n|      |\n|    \n|    \n|      \n|    \n|',
	'___\n|      |\n|    :dizzy_face: \n|      | \n|      \n|    \n|',
	'___\n|      |\n|    :dizzy_face: \n|    /|\\ \n|      \n|    \n|',
	'___\n|      |\n|    :dizzy_face: \n|    /|\\ \n|      |\n|    \n|',
	'___\n|      |\n|    :dizzy_face: \n|    /|\\ \n|      |\n|    /\n|',
	'___\n|      |\n|    :dizzy_face: \n|    /|\\ \n|      |\n|    / \\\n|',
];

export class Hangman {
	interaction: CommandInteraction;
	message: MessageHandler;
	players: User[];
	dmMessage: DmMessageHandler;
	word: string;
	displayWord = '';
	wrongGuesses = '';
	stage = 0;
	hasWon = false;

	constructor(interaction) {
		this.interaction = interaction;
		this.players = [interaction.user, interaction.options.getUser('playertwo')];

		this.runGame();
	}

	async runGame() {
		if (this.players[1] == null || this.players[1].bot) {
			await this.interaction.reply('The player could not be found or was a bot');
			return;
		}

		this.message = await getMessage(this.interaction, () => {
			this.hasWon = true;
		});
		if (!this.message) return;
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setDescription(`Waiting for a word to be chosen by ${this.interaction.user}`),
			],
		});

		try {
			const message = await this.players[0].send('Choose a word');
			this.dmMessage = new DmMessageHandler(message);
		} catch (err) {
			this.hasWon = true;
			return await this.message.edit({
				embeds: [
					new MessageEmbed()
						.setTitle('Something has gone wrong...  :face_with_monocle:')
						.setDescription(`${this.interaction.user}, looks like we can't send a message to you, please let Frodo dm you then run the command again!`)
						.setColor('#FF0134'),
				],
			});
		}
		if (this.hasWon) return;

		const channelFilter = (m: Message) => m.author.id == this.players[1].id;

		await this.players[0].dmChannel.awaitMessages({filter: () => true, max: 1, time: 300000, errors: ['time']}).then(async (collected) => {
			this.word = collected.first().content.replace(/ /g, '').toLowerCase();
			for (let i = 0; i < this.word.length; i++) this.displayWord += '-';
			await this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}`);

			this.reactToMessage();
		}).catch((err) => {
			this.hasWon = true;
			this.message.removeReactions();
			this.dmMessage.edit('You didn\'t enter a word fast enough!');
			return this.message.edit(`${this.interaction.user} took too long to put a word in!`);
		});

		while (!this.hasWon) {
			await this.message.channel.awaitMessages({filter: channelFilter, max: 1, time: 300000, errors: ['time']}).then((collected) => {
				if (this.hasWon) return;
				const letter = collected.first().content[0].toLowerCase();
				collected.first().delete().catch((e) => handleError(e, this.interaction));
				if (this.word.includes(letter)) {
					const displayWordArray = [...this.displayWord];
					for (let i = 0; i < displayWordArray.length; i++) {
						if (this.word[i] == letter) {
							displayWordArray[i] = letter;
						}
					}

					this.displayWord = displayWordArray.join('');
				} else {
					if (this.wrongGuesses.includes(letter)) return;
					this.wrongGuesses += letter;
					this.stage++;
				}

				this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}`);
				if (this.displayWord == this.word) {
					this.hasWon = true;
					this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}\n${this.players[1]} has won!`);
					this.message.removeReactions();
				} else if (this.stage == HangmanStages.length - 1) {
					this.hasWon = true;
					this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}\n${this.players[0]} has won!`);
					this.message.removeReactions();
				}
			}).catch((e) => {
				if (this.hasWon) return;
				this.hasWon = true;
				this.message.removeReactions();
				return this.message.edit(`The game timed out!`);
			});
		}
	}

	async updateMessage(attachment: string, init?: boolean) {
		await this.message.edit({
			content: init ? attachment : `${HangmanStages[this.stage]}\n${attachment}`,
			embeds: [],
		});
	}

	async reactToMessage() {
		await this.message.react('❌');
		const filter = (reaction, user) => (user.id === this.players[0].id || user.id === this.players[1].id) && reaction.emoji.name === '❌';
		this.message.awaitReactions({filter, max: 1})
			.then((col) => {
				if (!col.first()) return;
				if (this.hasWon) return;
				this.hasWon = true;
				this.message.removeReactions();
				this.message.edit(`The game was canceled!`);
			});
	}
}
