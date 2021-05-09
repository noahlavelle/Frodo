import {Aki} from 'aki-api';

const region = 'en';
import {CommandInteraction, Message, MessageEmbed} from 'discord.js';
import {removeReaction} from './utils';

const NumberReactions = {
	'1️⃣': 0,
	'2️⃣': 1,
	'3️⃣': 2,
	'4️⃣': 3,
	'5️⃣': 4,
};

const LetterReactions = {
	'🇾': 0,
	'🇳': 1,
};

export class Akinator {
	message: Message;
	aki: Aki;
	interaction: CommandInteraction;

	constructor(interaction) {
		this.interaction = interaction;
		this.aki = new Aki(region);

		this.runGame();
	}

	async runGame() {
		await this.interaction.defer();
		await this.interaction.fetchReply().then((msg) => this.message = msg);
		await this.aki.start();
		let hasWon = false;
		await this.updateMessage();

		for (const reaction of Object.keys(NumberReactions)) {
			await this.message.react(reaction);
		}

		const filter = (reaction, user) => {
			return Object.keys(NumberReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
		};

		while (!hasWon) {
			this.interaction.fetchReply().then((msg) => this.message = msg);
			await this.message.awaitReactions(filter, {max: 1}).then(async (collected) => {
				const response = NumberReactions[collected.first().emoji.name];

				await removeReaction(this.message, this.interaction.user);

				if (response == 5) {
					await this.aki.back();
				} else {
					await this.aki.step(response);
				}

				await this.updateMessage();

				if (this.aki.progress >= 75 || this.aki.currentStep >= 78) {
					await this.aki.win();
					hasWon = true;
					await this.win();
					return;
				}
			});
		}
	}

	async win() {
		let choiceMade = false;
		await this.message.reactions.removeAll();
		const filter = (reaction, user) => {
			return Object.keys(LetterReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
		};

		await this.updateWinMessage('Am I right?', 0);

		for (const letter of Object.keys(LetterReactions)) {
			await this.message.react(letter);
		}

		for (let i = 0; i < this.aki.guessCount && !choiceMade; i++) {
			await this.updateWinMessage('Am I right?', i);

			await this.message.awaitReactions(filter, {max: 1}).then(async (collected) => {
				await removeReaction(this.message, this.interaction.user);
				if (collected.first().emoji.name == Object.keys(LetterReactions)[0]) {
					await this.updateWinMessage('I win again!', i);
					await this.message.reactions.removeAll();
					choiceMade = true;
				}
			});
		}
	}

	async updateWinMessage(description : string, i : number) {
		await this.interaction.editReply('', new MessageEmbed()
			.setTitle('Akinator:')
			.setColor('#3498db')
			.addFields(
				{name: 'Name:', value: this.aki.answers[i].name},
				{name: 'Description:', value: this.aki.answers[i].description},
			)
			.setImage(this.aki.answers[i].absolute_picture_path)
			.setThumbnail('https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw')
			.setDescription(description));
	}

	async updateMessage() {
		await this.interaction.editReply('', new MessageEmbed()
			.setTitle('Akinator:')
			.setColor('#3498db')
			.setThumbnail('https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw')
			.addFields(
				{name: 'Question:', value: this.aki.question},
				{
					name: 'Answers:',
					value: `\n0: ${this.aki.answers[0]}\n1: ${this.aki.answers[1]}\n2: ${
						this.aki.answers[2]}\n3: ${this.aki.answers[3]}\n4: ${this.aki.answers[4]}\n5: Back`,
				},
				{name: 'Progress:', value: this.aki.progress},
			));
	}
}
