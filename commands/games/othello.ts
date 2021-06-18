import {CommandInteraction, GuildEmoji, Message, MessageEmbed, User} from 'discord.js';
import {client} from '../../index';
import {removeReaction} from './utils';

const gridEmojis: any[] = [
	'<:gr:851050647302438912>',
	'<:p0:851054097129144340>',
	'<:p1:851054110673076224>',
	'<:sr:851055934172430336>',
];
const clearEmojis = [
	'<:p0c:851057388030525440>',
	'<:p1c:851057401003900938>',
];

const letterReactions = {
	'851062972055158836': 0,
	'851062988869468180': 1,
	'851062997669380096': 2,
	'851063007739772948': 3,
	'851063057978359822': 4,
	'851063019182227456': 5,
	'851063029588164609': 6,
	'851063048348368927': 7,
};
const letterReactionsFilter = {
	'la': 0,
	'lb': 1,
	'lc': 2,
	'ld': 3,
	'le': 4,
	'lf': 5,
	'lg': 6,
	'lh': 7,
};
const numberReactions = {
	'851065666341699584': 0,
	'851065679682469888': 1,
	'851065688436899861': 2,
	'851065697873690654': 3,
	'851065706735992893': 4,
	'851065718644801546': 5,
	'851065729570963456': 6,
	'851065741817675796': 7,
};
const numberReactionsFilter = {
	'l1': 0,
	'l2': 1,
	'l3': 2,
	'l4': 3,
	'l5': 4,
	'l6': 5,
	'l7': 6,
	'l8': 7,
};
const controlReactions = {
	'✅': 0,
	'❌': 1,
};
function changeInt(int: number) {
	int++;
	if (int == 2) int = 0;
	return int;
};

export class Othello {
	interaction: CommandInteraction;
	grid: number[][];
	players: User[];
	message: Message;
	playersGo: number;
	row: number;
	column: number;
	playing: boolean;

	constructor(interaction) {
		this.playing = true;
		this.interaction = interaction;
		this.grid = [
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 1, 2, 0, 0, 0],
			[0, 0, 0, 2, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
		];
		for (let i = 1; i < 9; i++) {
			this.grid[-i] = [];
			this.grid[i + 7] = [];
		};
		this.playersGo = 0;
		this.startGame();
	};
	async startGame() {
		if (Math.round(Math.random()) === 0) {
			this.players = [this.interaction.user, await client.users.fetch(String(this.interaction.options[0].value))];
		} else {
			this.players = [await client.users.fetch(String(this.interaction.options[0].value)), this.interaction.user];
		};
		if (!this.players[1] || this.players[1].bot) return this.interaction.reply('The player could not be found or was a bot');
		if (this.interaction.user.id === this.interaction.options[0].value) return this.interaction.reply('You can\'t play othello with yourself!');
		await this.updateMessage();
		await this.reactToMessage(this.message);
		this.playerGo();
	};
	async playerGo() {
		const filter = (reaction, user) => (Object.keys(letterReactionsFilter).includes(reaction.emoji.name) || Object.keys(numberReactionsFilter).includes(reaction.emoji.name) || Object.keys(controlReactions).includes(reaction.emoji.name)) && this.players[this.playersGo].id == user.id;
		await this.message.awaitReactions(filter, {max: 1, time: 300000, errors: ['time']})
			.then(async (collected) => {
				const letter = Object.keys(letterReactionsFilter).includes(collected.first().emoji.name);
				const number = Object.keys(numberReactionsFilter).includes(collected.first().emoji.name);
				const control = Object.keys(controlReactions).includes(collected.first().emoji.name);
				await removeReaction(this.message, this.players[this.playersGo]);

				if (letter) {
					this.row = letterReactionsFilter[collected.first().emoji.name];
					this.grid.forEach((row, rowIndex) => {
						row.forEach((value, columnIndex) => {
							if (value === 3) this.grid[rowIndex][columnIndex] = 0;
						});
					});
					if (this.column === undefined) {
						this.grid[this.row].forEach((value, columnNumber) => {
							if (value === 0) {
								this.grid[this.row][columnNumber] = 3;
							};
						});
					} else {
						if (this.grid[this.row][this.column] === 0) {
							this.grid[this.row][this.column] = 3;
						} else {
							this.row = undefined;
							this.column = undefined;
							this.playerGo();
						};
					};
				} else if (number) {
					this.column = numberReactionsFilter[collected.first().emoji.name];
					this.grid.forEach((row, rowIndex) => {
						row.forEach((value, columnIndex) => {
							if (value === 3) this.grid[rowIndex][columnIndex] = 0;
						});
					});
					if (this.row === undefined) {
						this.grid.forEach((row, rowNumber) => {
							if (row[this.column] === 0) {
								this.grid[rowNumber][this.column] = 3;
							};
						});
					} else {
						if (this.grid[this.row][this.column] === 0) {
							this.grid[this.row][this.column] = 3;
						} else {
							this.row = undefined;
							this.column = undefined;
							this.playerGo();
						};
					};
				} else if (control) {
					this.grid.forEach((row, rowIndex) => {
						row.forEach((value, columnIndex) => {
							if (value === 3) this.grid[rowIndex][columnIndex] = 0;
						});
					});
					const action = controlReactions[collected.first().emoji.name];
					if (action === 0) {
						if (this.row !== undefined && this.column !== undefined) {
							if (this.checkGrid(this.row, this.column, false)) {
								if (this.grid[this.row][this.column] === 1 || this.grid[this.row][this.column] === 2) {
									this.row = undefined;
									this.column = undefined;
									return this.playerGo();
								};
								// @ts-ignore
								this.checkGrid(this.row, this.column, true).forEach((direction) => {
									const otherPlayer = changeInt(this.playersGo) + 1;
									const player = this.playersGo + 1;
									let pos = [this.row, this.column];

									for (let i = 1; i < 9; i++) {
										pos = [pos[0] + direction[0], pos[1] + direction[1]];
										if (this.grid[pos[0]][pos[1]] === 0 || this.grid[pos[0]][pos[1]] === player) return;
										if (this.grid[pos[0]][pos[1]] === otherPlayer) {
											this.grid[pos[0]][pos[1]] = player;
										};
									};
								});

								this.grid[this.row][this.column] = this.playersGo + 1;
								this.row = undefined;
								this.column = undefined;
								this.playersGo = changeInt(this.playersGo);
								let nextPlayerCanGo = false;

								this.grid.forEach((row, rowIndex) => {
									if (nextPlayerCanGo) return;
									row.forEach((value, columnIndex) => {
										if (nextPlayerCanGo) return;
										if (value !== 0) return;
										// @ts-ignore
										nextPlayerCanGo = this.checkGrid(rowIndex, columnIndex, false);
									});
								});
								if (!nextPlayerCanGo) {
									this.playersGo = changeInt(this.playersGo);
									let otherPlayerCanGo = false;

									this.grid.forEach((row, rowIndex) => {
										if (otherPlayerCanGo) return;
										row.forEach((value, columnIndex) => {
											if (otherPlayerCanGo) return;
											if (value !== 0) return;
											// @ts-ignore
											otherPlayerCanGo = this.checkGrid(rowIndex, columnIndex, false);
										});
									});
									if (!otherPlayerCanGo) {
										return this.gameOver();
									};
								};
							} else {
								this.row = undefined;
								this.column = undefined;
							};
						};
					} else {
						this.row = undefined;
						this.column = undefined;
					};
				};
				if (this.playing) {
					this.updateMessage();
					this.playerGo();
				};
			})
			.catch((err) => {
				this.message.reactions.removeAll();
				return this.interaction.editReply('The game has timed out!');
			});
	};

	checkGrid(row, column, returnArray) {
		let allow = false;
		const returnArr = [];
		if (this.grid[row][column] !== 0) return allow = false;
		([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]).forEach((direction) => {
			if (allow || (!row && !column)) return;
			let pos = [row, column];
			if (this.grid[row + direction[0]][column + direction[1]] !== changeInt(this.playersGo) + 1) return;
			for (let i = 1; i < 9; i++) {
				pos = [pos[0] + direction[0], pos[1] + direction[1]];
				if (this.grid[pos[0]][pos[1]] === 0) return;
				if (i !== 1 && this.grid[pos[0]][pos[1]] === this.playersGo + 1) {
					if (returnArray) return returnArr.push(direction);
					return allow = true;
				};
			};
		});
		return returnArray ? returnArr : allow;
	};

	async updateMessage() {
		let black = 0;
		let white = 0;
		this.grid.forEach((row) => {
			row.forEach((value) => {
				if (value === 1) black++;
				else if (value === 2) white++;
			});
		});
		if (this.interaction.replied) {
			await this.message.edit(`<@${this.interaction.user.id}> challenged <@${this.interaction.options[0].value}> to a game of othello!`,
				new MessageEmbed()
					.setColor('#78B159')
					.setFooter(`${this.players[0].username}: ${black}, ${this.players[1].username}: ${white}`)
					.setDescription(`Current go: ${clearEmojis[this.playersGo]} <@${this.players[this.playersGo].id}>\n\n${this.stringGrid()}`),
			);
		} else {
			await this.interaction.reply(`<@${this.interaction.user.id}> challenged <@${this.interaction.options[0].value}> to a game of othello!`,
				new MessageEmbed()
					.setColor('#78B159')
					.setFooter(`${this.players[0].username}: ${black}, ${this.players[1].username}: ${white}`)
					.setDescription(`Current go: ${clearEmojis[this.playersGo]} <@${this.players[this.playersGo].id}>\n\n${this.stringGrid()}`),
			);
			this.message = await this.interaction.fetchReply();
		};
		return null;
	};
	gameOver() {
		this.playing = false;
		let black = 0;
		let white = 0;
		this.grid.forEach((row) => {
			row.forEach((value) => {
				if (value === 1) black++;
				else if (value === 2) white++;
			});
		});
		this.message.reactions.removeAll();
		let text = '';
		if (black === white) text = 'You Drew!';
		else if (black > white) text = `<@${this.players[0].id}> Won!`;
		else if (white > black) text = `<@${this.players[0].id} Won!`;
		this.interaction.editReply(text,
			new MessageEmbed()
				.setColor('#78B159')
				.setFooter(`${this.players[0].username}: ${black}, ${this.players[1].username}: ${white}`)
				.setDescription(`\n${this.stringGrid()}`),
		);
	};
	stringGrid() {
		for (let i = 1; i < 9; i++) {
			this.grid[-i] = [];
			this.grid[i + 7] = [];
		};
		const grid: any[] = [
			['<:cr:851050658362032138>', '<:l1:851065666341699584>', '<:l2:851065679682469888>', '<:l3:851065688436899861>', '<:l4:851065697873690654>', '<:l5:851065706735992893>', '<:l6:851065718644801546>', '<:l7:851065729570963456>', '<:l8:851065741817675796>'],
			['<:la:851062972055158836>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:lb:851062988869468180>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:lc:851062997669380096>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:ld:851063007739772948>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:le:851063057978359822>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:lf:851063019182227456>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:lg:851063029588164609>', 0, 0, 0, 0, 0, 0, 0, 0],
			['<:lh:851063048348368927>', 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.grid.forEach((row, rowNumber) => {
			row.forEach((value, columnNumber) => {
				grid[rowNumber + 1][columnNumber + 1] = gridEmojis[value];
			});
		});
		grid.forEach((arr, index) => {
			grid[index] = arr.join('');
		});
		return grid.join('\n');
	};
	async reactToMessage(message: Message) {
		for (const emoji of Object.keys(letterReactions)) {
			await message.react(emoji);
		};
		for (const emoji of Object.keys(numberReactions)) {
			await message.react(emoji);
		};
		for (const emoji of Object.keys(controlReactions)) {
			await message.react(emoji);
		};
		return undefined;
	};
};
