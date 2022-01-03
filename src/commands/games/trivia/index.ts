import {CommandInteraction, MessageEmbed, ButtonInteraction} from 'discord.js';

import {EmbedColor} from '../../index';
import fetch from 'node-fetch';
import atob from 'atob';
import {SlashCommandBuilder} from '@discordjs/builders';
import {registerCommands} from '../../refreshCommands';
import handleError, {Button, createButtonRow, getMessage, MessageHandler} from '../../utils';
import {addUserToScoreboard} from '../../scoreboard';
const letterMap: string[] = ['A', 'B', 'C', 'D'];
let games = [];
let gamesEmbed: MessageEmbed;
let error: Boolean = false;
const errorEmbed: MessageEmbed = new MessageEmbed()
	.setColor('#ff0000')
	.setTitle('Error')
	.setDescription('Hm, looks like there was an error when trying to get your question.');
(async () => {
	let json;
	try {
		json = await (await fetch('https://opentdb.com/api_category.php')).json();
	} catch (err) {
		console.log(err);
		error = true;
	}
	if (error) return;
	games = json.trivia_categories;
	let cats = '';
	games.forEach((cat) => cats += cat.name + '\n');
	gamesEmbed = new MessageEmbed()
		.setColor(EmbedColor)
		.setTitle('Question Categories')
		.setDescription(cats)
		.addField('Difficulties', 'Easy\nMedium\nHard\nAny')
		.setFooter('Type /trivia <difficulty> <category> and make sure to not use any spaces in the category');
	// eslint-disable-next-line prefer-const
	let commandArray: [name: string, value: string][] = [];
	games.forEach((cat) => commandArray.push([
		cat.name,
		cat.name,
	]));
	const command = new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('A game of Trivia')
		.addStringOption((option) => {
			option
				.setName('difficulty')
				.setDescription('Select the difficulty of the question')
				.addChoices([
					[
						'Easy',
						'easy',
					],
					[
						'Medium',
						'medium',
					],
					[
						'Hard',
						'hard',
					],
					[
						'Any',
						'any',
					],
				]);
			return option;
		})
		.addStringOption((option) => {
			option
				.setName('category')
				.setDescription('Select the category of the question')
				.addChoices(commandArray);
			return option;
		});
	registerCommands([command.toJSON()]);
})();

export class Trivia {
	interaction: CommandInteraction;
	message: MessageHandler;
	options: string[];
	answer: number;
	questionJSON;
	buttons: Button[];
	finished: boolean;

	constructor(interaction) {
		if (error) return interaction.reply(errorEmbed);
		this.interaction = interaction;
		this.init();
	}

	async init() {
		const difficulty = this.interaction.options.getString('difficulty');
		const category = this.interaction.options.getString('category');

		this.message = await getMessage(this.interaction);
		if (!this.message) return;

		let url: string = 'https://opentdb.com/api.php?amount=1&encode=base64';
		if (difficulty && difficulty != 'any') url += `&difficulty=${difficulty}`;
		if (category) {
			let id;
			games.forEach((cate) => {
				if (cate.name == category) id = id = cate.id;
			});
			url += `&category=${id}`;
		}
		let json;
		try {
			json = await (await fetch(url)).json();
		} catch (err) {
			return this.message.edit({embeds: [errorEmbed]});
		}
		this.questionJSON = json;

		if (json.response_code != 0) return this.message.edit({embeds: [errorEmbed]});
		this.options = [];
		if (atob(json.results[0].type) === 'boolean') {
			this.options = [
				`${letterMap[0]} - True`,
				`${letterMap[1]} - False`,
			];
			this.answer = atob(json.results[0].correct_answer) === 'True' ? 0 : 1;
		} else {
			const ranQ = Math.round(Math.random() * 3);
			this.answer = ranQ;
			let currentAnswer = 0;
			this.options[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}`;
			if (!this.options[0]) this.options[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer++])}`;
			if (!this.options[1]) this.options[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer++])}`;
			if (!this.options[2]) this.options[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer++])}`;
			if (!this.options[3]) this.options[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer++])}`;
		}
		this.buttons = [];
		this.options.forEach((value, index) => {
			this.buttons.push({
				label: letterMap[index],
				id: index.toString(),
			});
		});
		await this.message.edit({
			embeds: [
				new MessageEmbed()
					.setColor(EmbedColor)
					.setTitle(atob(json.results[0].question))
					.setDescription(this.options.join('\n'))
					.setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
			],
			components: [
				createButtonRow(this.interaction, ...this.buttons),
			],
		});
		setTimeout(() => {
			if (this.finished) return;
			this.options[this.answer] = `**${this.options[this.answer]}**`;
			this.buttons = this.buttons.map((value) => {
				value.disabled = true;
				return value;
			});
			this.buttons[this.answer].style = 'SUCCESS';
			this.message.edit({
				content: `The game timed out! The correct answer was :regional_indicator_${letterMap[this.answer].toLocaleLowerCase()}:`,
				components: [
					createButtonRow(this.interaction, ...this.buttons),
				],
				embeds: [
					new MessageEmbed()
						.setColor(EmbedColor)
						.setTitle(atob(this.questionJSON.results[0].question))
						.setDescription(this.options.join('\n'))
						.setFooter(`Category - ${atob(this.questionJSON.results[0].category)}, Difficulty - ${atob(this.questionJSON.results[0].difficulty)}`),
				]},
			);
		}, 60000);
	};
	async onButtonClick(id, interaction: ButtonInteraction) {
		if (interaction.user.id !== this.interaction.user.id) {
			interaction.reply({
				content: 'Only one person can answer the question, run `/trivia` for your own question',
				ephemeral: true,
			}).catch(() => {});
			return false;
		}
		this.finished = true;
		this.buttons = this.buttons.map((value) => {
			value.disabled = true;
			return value;
		});
		if (id == this.answer) {
			this.buttons[id].style = 'SUCCESS';
			this.options[this.answer] += ' :white_check_mark:';
			await this.message.edit({
				content: `Correct :smile:`,
				embeds: [
					new MessageEmbed()
						.setColor(EmbedColor)
						.setTitle(atob(this.questionJSON.results[0].question))
						.setDescription(this.options.join('\n'))
						.setFooter(`Category - ${atob(this.questionJSON.results[0].category)}, Difficulty - ${atob(this.questionJSON.results[0].difficulty)}`),
				],
				components: [
					createButtonRow(this.interaction, ...this.buttons),
				],
			});
			addUserToScoreboard(this.interaction.user);
		} else {
			this.buttons[id].style = 'DANGER';
			this.options[id] += ' :x:';
			await this.message.edit({
				content: `You got it wrong :cry:, The answer was :regional_indicator_${letterMap[this.answer].toLocaleLowerCase()}:`,
				embeds: [
					new MessageEmbed()
						.setColor(EmbedColor)
						.setTitle(atob(this.questionJSON.results[0].question))
						.setDescription(this.options.join('\n'))
						.setFooter(`Category - ${atob(this.questionJSON.results[0].category)}, Difficulty - ${atob(this.questionJSON.results[0].difficulty)}`),
				],
				components: [
					createButtonRow(this.interaction, ...this.buttons),
				],
			});
		}
		return true;
	}
}

export async function triviaCategories(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
	if (error) return message.edit({embeds: [errorEmbed]});
	message.edit({embeds: [gamesEmbed]});
}
