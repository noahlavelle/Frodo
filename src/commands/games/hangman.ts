import {Channel, CommandInteraction, Message, TextChannel, User} from 'discord.js';
import {client} from '../../index';
import {DmMessageHandler, getMessage, MessageHandler} from '../../utils';

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
		await this.updateMessage(`Waiting for a word to be chosen by ${this.interaction.user}`);
		this.dmMessage = new DmMessageHandler(await this.players[0].send('Choose a word'));

		const channelFilter = (m: Message) => m.author.id == this.players[1].id;

		await this.players[0].dmChannel.awaitMessages({filter: () => true, max: 1, time: 300000, errors: ['time']}).then(async (collected) => {
			this.word = collected.first().content.replace(/ /g, '').toLowerCase();
			for (let i = 0; i < this.word.length; i++) this.displayWord += '-';
			await this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}`);
		}).catch((err) => {
			this.hasWon = true;
			this.dmMessage.edit('You didn\'t enter a word fast enough!');
			return this.message.edit(`${this.interaction.user} took too long to put a word in!`);
		});

		while (!this.hasWon) {
			await this.message.channel.awaitMessages({filter: channelFilter, max: 1, time: 300000, errors: ['time']}).then((collected) => {
				const letter = collected.first().content[0].toLowerCase();
				collected.first().delete();
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
				} else if (this.stage == HangmanStages.length - 1) {
					this.hasWon = true;
					this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}\n${this.players[0]} has won!`);
				}
			}).catch((e) => {
				this.hasWon = true;
				this.dmMessage.edit('You didn\'t enter a word fast enough!');
				return this.message.edit(`${this.interaction.user} took too long to put a word in!`);
			});
		}
	}

	async updateMessage(attachment: string) {
		await this.message.edit(`${HangmanStages[this.stage]}\n${attachment}`);
	}
}
