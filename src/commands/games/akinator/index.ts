import {Aki} from 'aki-api';

const region = 'en';
import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Button, createButtonRow, getMessage, MessageHandler} from '../../../utils';
import {guess} from 'aki-api/typings/src/functions';

const NumberReactions = {
	'851065666341699584': 0,
	'851065679682469888': 1,
	'851065688436899861': 2,
	'851065697873690654': 3,
	'851065706735992893': 4,
	'851065718644801546': 5,
};
const NumberReactionsFilter = {
	'l1': 0,
	'l2': 1,
	'l3': 2,
	'l4': 3,
	'l5': 4,
	'l6': 5,
};

const LetterReactions = {
	'🇾': 0,
	'🇳': 1,
};

export class Akinator {
	message: MessageHandler;
	aki: Aki;
	interaction: CommandInteraction;
	buttons: Button[];
	winButtons: Button[];
	backButton: Button;
	currentGuess: number;
	hasWon = false;
	choiceMade: boolean;
	finished: boolean;

	constructor(interaction) {
		this.interaction = interaction;
		this.aki = new Aki({region, childMode: false});
		this.choiceMade = false;
		this.finished = false;
		this.currentGuess = 0;

		this.buttons = [
			{
				label: 'Yes',
				id: '0',
				style: 'SUCCESS',
			},
			{
				label: 'No',
				id: '1',
				style: 'DANGER',
			},
			{
				label: 'Don\'t know',
				id: '2',
			},
			{
				label: 'Probably',
				id: '3',
			},
			{
				label: 'Probably Not',
				id: '4',
			},
		];
		this.backButton = {
			label: 'Back',
			id: '5',
			style: 'SECONDARY',
		};
		this.winButtons = [
			{
				label: 'Yes',
				id: '11',
				style: 'SUCCESS',
			},
			{
				label: 'No',
				id: '12',
				style: 'DANGER',
			},
		];


		this.runGame();
	}

	async runGame() {
		this.message = await getMessage(this.interaction);
		if (!this.message) return;
		await this.aki.start();
		await this.updateMessage();
	}

	async win() {
		await this.updateWinMessage('Am I right?', 0);

		this.winStep();
	}

	async winStep() {
		await this.updateWinMessage('Am I right?', this.currentGuess);
		this.currentGuess++;
	}

	async updateWinMessage(description : string, i : number) {
		const answers: guess = <guess> this.aki.answers[i];
		if (this.finished) {
			this.buttons = this.winButtons.map((value) => {
				value.disabled = true;
				return value;
			});
		}
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle('Akinator:')
					.setColor('#3498db')
					.addFields(
						{name: 'Name:', value: answers.name},
						{name: 'Description:', value: answers.description},
					)
					.setImage(answers.absolute_picture_path)
					.setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png'),
			],
			components: [
				createButtonRow(this.interaction, ...this.winButtons),
			],
			content: description,
		});
	}

	async updateMessage() {
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle('Akinator:')
					.setColor('#3498db')
					.setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png')
					.addFields(
						{name: 'Question:', value: this.aki.question},
						{name: 'Progress:', value: String(this.aki.progress)},
					),
			],
			components: [
				createButtonRow(this.interaction, ...this.buttons),
				createButtonRow(this.interaction, this.backButton),
			],
		});
	}

	async onButtonClick(id, interaction) {
		if (this.finished) return;
		if (interaction.user.id !== this.interaction.user.id) {
			interaction.reply({
				content: 'Only one person can play, run `/akinator` for your own game',
				ephemeral: true,
			}).catch(() => {});
			return;
		}
		if (id > 10) {
			if (id == 11) {
				this.finished = true;
				this.updateWinMessage('I win again!', this.currentGuess - 1);
				this.choiceMade = true;
			} else if (id == 12) {
				if (this.currentGuess < this.aki.guessCount && !this.choiceMade) {
					await this.winStep();
				} else {
					this.finished = true;
					await this.updateWinMessage('I don\'t know, you win!', this.aki.guessCount - 1);
				}
			}
			return true;
		} else {
			if (id == 5) {
				await this.aki.back();
			} else {
				await this.aki.step(id);
			}
		}

		await this.updateMessage();

		if (this.aki.progress >= 75 || this.aki.currentStep >= 78) {
			await this.aki.win();
			this.hasWon = true;
			await this.win();
			return;
		}
		return true;
	}
}
