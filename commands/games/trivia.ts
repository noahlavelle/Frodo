import {CommandInteraction, Message, User, MessageEmbed} from 'discord.js';
import {EmbedColor, client} from '../../index';
import fetch = require('node-fetch');
import atob = require('atob');
import {SlashCommandBuilder} from '@discordjs/builders';
import {Routes} from 'discord-api-types';
import {registerCommands} from '../../refreshCommands';
import {getMessage} from './utils';
const characters: string[] = ['🇦', '🇧', '🇨', '🇩'];
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
	message: Message;

	constructor(interaction) {
		if (error) return interaction.reply(errorEmbed);
		this.interaction = interaction;
		this.init();
	}

	async init() {
		const difficulty = this.interaction.options.getString('difficulty');
		const category = this.interaction.options.getString('category');

		await this.interaction.deferReply();

		let url: String = 'https://opentdb.com/api.php?amount=1&encode=base64';
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
			return this.interaction.editReply({embeds: [errorEmbed]});
		}
		if (json.response_code != 0) return this.interaction.editReply({embeds: [errorEmbed]});
		let options: string[] = [];
		let optionsTimeOut: string[] = [];
		let optionsAnswerCorrect: string[] = [];
		let optionsAnswerIncorrect: string[] = [];
		let answer;
		if (atob(json.results[0].type) === 'boolean') {
			options = [
				`${letterMap[0]} - True`,
				`${letterMap[1]} - False`,
			];
			optionsTimeOut = [
				`${letterMap[0]} - ${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}True${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}`,
				`${letterMap[1]} - ${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}False${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}`,
			];
			optionsAnswerCorrect = [
				`${letterMap[0]} - True${atob(json.results[0].correct_answer) === 'True' ? ' :white_check_mark:' : ''}`,
				`${letterMap[1]} - False${atob(json.results[0].correct_answer) === 'False' ? ' :white_check_mark:' : ''}`,
			];
			optionsAnswerIncorrect = [
				`${letterMap[0]} - True`,
				`${letterMap[1]} - False`,
			];
			answer = atob(json.results[0].correct_answer) === 'True' ? 0 : 1;
		} else {
			const ranQ = Math.round(Math.random() * 3);
			answer = ranQ;
			let currentAnswer = 0;
			options[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}`;
			optionsTimeOut[ranQ] = `**${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}**`;
			optionsAnswerCorrect[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)} :white_check_mark:`;
			optionsAnswerIncorrect[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}`;
			if (!options[0]) {
				options[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsTimeOut[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerCorrect[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerIncorrect[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				currentAnswer++;
			}
			if (!options[1]) {
				options[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsTimeOut[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerCorrect[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerIncorrect[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				currentAnswer++;
			}
			if (!options[2]) {
				options[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsTimeOut[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerCorrect[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerIncorrect[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				currentAnswer++;
			}
			if (!options[3]) {
				options[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsTimeOut[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerCorrect[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				optionsAnswerIncorrect[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
				currentAnswer++;
			}
		}
		await this.interaction.editReply({
			embeds: [
				new MessageEmbed()
					.setColor(EmbedColor)
					.setTitle(atob(json.results[0].question))
					.setDescription(options.join('\n'))
					.setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
			]});
		this.message = await getMessage(this.interaction);
		options.forEach((a, index) => this.message.react(characters[index]));
		const filter = (r, user) => user.id == this.interaction.user.id && characters.includes(r.emoji.name);
		this.message.awaitReactions({filter, max: 1, time: 30000, errors: ['time']},
		).then((col) => {
			this.message.reactions.removeAll();

			if (characters.indexOf(col.first().emoji.name) == answer) {
				this.interaction.editReply({
					content: `Correct :smile:`,
					embeds: [
						new MessageEmbed()
							.setColor(EmbedColor)
							.setTitle(atob(json.results[0].question))
							.setDescription(optionsAnswerCorrect.join('\n'))
							.setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
					]});
			} else {
				optionsAnswerIncorrect[characters.indexOf(col.first().emoji.name)] += ' :x:';
				this.interaction.editReply({
					content: `You got it wrong :cry:, The answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`,
					embeds: [
						new MessageEmbed()
							.setColor(EmbedColor)
							.setTitle(atob(json.results[0].question))
							.setDescription(optionsAnswerIncorrect.join('\n'))
							.setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
					]});
			}
		}).catch(() => {
			this.message.reactions.removeAll();
			this.interaction.editReply({
				content: `The game timed out! The correct answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`,
				embeds: [
					new MessageEmbed()
						.setColor(EmbedColor)
						.setTitle(atob(json.results[0].question))
						.setDescription(optionsTimeOut.join('\n'))
						.setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
				]});
		});
	};
}

export function triviaCategories(interaction: CommandInteraction) {
	if (error) return interaction.reply({embeds: [errorEmbed]});
	interaction.reply({embeds: [gamesEmbed]});
}
