import {CommandInteraction, Message, MessageEmbed, User} from 'discord.js';
import {client, EmbedColor} from '../../index';
import {getMessage, MessageHandler} from '../../utils';

const NumberReactions = {
	'856566113851932672': 1,
	'856566113872510976': 2,
	'856566113818902558': 3,
	'856566113894400030': 4,
	'856566113605648405': 5,
	'856566113864122408': 6,
	'856566113763328051': 7,
	'856566114006728714': 8,
	'856566113881161798': 9,
};
const NumberReactionsFilter = {
	't1': 1,
	't2': 2,
	't3': 3,
	't4': 4,
	't5': 5,
	't6': 6,
	't7': 7,
	't8': 8,
	't9': 9,
};
const Grid = [
	[`<:t1:856566113851932672>`, `<:t2:856566113872510976>`, `<:t3:856566113818902558>`],
	[`<:t4:856566113894400030>`, `<:t5:856566113605648405>`, `<:t6:856566113864122408>`],
	[`<:t7:856566113763328051>`, `<:t8:856566114006728714>`, `<:t9:856566113881161798>`],
];
const GridFilter = [
	`<:t1:856566113851932672>`,
	`<:t2:856566113872510976>`,
	`<:t3:856566113818902558>`,
	`<:t4:856566113894400030>`,
	`<:t5:856566113605648405>`,
	`<:t6:856566113864122408>`,
	`<:t7:856566113763328051>`,
	`<:t8:856566114006728714>`,
	`<:t9:856566113881161798>`,
];
const PlayerEmojis = [
	'<:tx:856571744486424576>',
	'<:to:856571744545406976>',
	'<:txc:856571744584466452>',
	'<:toc:856571744458244146>',
];

export class Ttt {
	interaction: CommandInteraction;
	message: MessageHandler;
	players: User[];
	currentPlayer: User;
	isPlayerOne: boolean;
	grid: any[][];

	constructor(interaction) {
		this.interaction = interaction;
		if (Math.round(Math.random()) === 0) {
			this.players = [this.interaction.user, this.interaction.options.getUser('playertwo')];
		} else {
			this.players = [this.interaction.options.getUser('playertwo'), this.interaction.user];
		};
		this.currentPlayer = this.players[0];
		this.isPlayerOne = true;
		this.grid = [];
		this.runGame();
	}

	async runGame() {
		this.message = await getMessage(this.interaction);
		if (this.players[1] == null || this.players[1].bot) {
			await this.message.edit('The player could not be found or was a bot');
			return;
		}

		let hasWon = false;
		for (let i = 0; i < 3; i++) {
			this.grid.push([]);
			for (let j = 0; j < 3; j++) {
				this.grid[i].push(Grid[i][j]);
			}
		}

		await this.updateMessage();
		for (const reaction of Object.keys(NumberReactions)) {
			await this.message.react(reaction);
		}

		const filter = (reaction, user) => {
			return Object.keys(NumberReactionsFilter).includes(reaction.emoji.name) && this.currentPlayer.id == user.id;
		};

		while (!hasWon) {
			await this.message.awaitReactions({filter, max: 1, time: 300000, errors: ['time']}).then(async (collected) => {
				const selectedNumber = NumberReactionsFilter[collected.first().emoji.name];
				await this.message.reactions.cache.get(Object.keys(NumberReactions)[selectedNumber - 1]).remove();

				const rowNumber = Math.ceil(selectedNumber / 3) - 1;
				const columnNumber = (selectedNumber - (rowNumber * 3)) - 1;
				if (!GridFilter.includes(this.grid[rowNumber][columnNumber])) return;
				this.grid[rowNumber][columnNumber] = this.isPlayerOne ? PlayerEmojis[0] : PlayerEmojis[1];

				let isWin: boolean;
				isWin = this.checkHorizontalWin(rowNumber);
				isWin = !isWin ? this.checkVerticalWin(columnNumber) : isWin;
				isWin = !isWin ? this.checkDiagonalWin(true) : isWin;
				isWin = !isWin ? this.checkDiagonalWin(false) : isWin;

				if (isWin) {
					hasWon = true;
					return this.win();
				}
				let draw = true;
				this.grid.forEach((row) => {
					row.forEach((value) => {
						if (GridFilter.includes(value)) draw = false;
					});
				});
				if (draw) {
					hasWon = true;
					return this.draw();
				}

				this.isPlayerOne = !this.isPlayerOne;
				this.currentPlayer = this.isPlayerOne ? this.players[0] : this.players[1];
				await this.updateMessage();
			})
				.catch(async (err) => {
					hasWon = true;
					await this.message.removeReactions();
					await this.message.edit('The game has timed out!');
				});
		}
	}

	checkHorizontalWin(rowNumber: number) {
		let streak = 0;
		for (let i = 0; i < 3; i++) {
			if (this.grid[rowNumber][i] == (this.isPlayerOne ? PlayerEmojis[0] : PlayerEmojis[1])) {
				streak++;
				if (streak == 3) {
					return true;
				}
			}
		}
	}

	checkVerticalWin(columnNumber: number) {
		let streak = 0;
		for (let i = columnNumber; i < 9; i += 3) {
			streak = this.checkIfWin(i, streak);
			if (streak == 3) return true;
		}
	}

	checkDiagonalWin(isTop : boolean) {
		const columnNumber = isTop ? 0 : 3;
		const rowNumber = isTop ? 0 : 3;
		let streak = 0;

		for (let i = (rowNumber * 3) + columnNumber; i < 9; isTop ? i += 4 : i -= 4) {
			streak = this.checkIfWin(i, streak);
			if (streak == 3) return true;
		}
	}

	checkIfWin(i : number, streak : number) {
		const rowNumber = Math.ceil((i + 1) / 3) - 1;
		const columnNumber = (i - (rowNumber * 3));
		if (this.grid[rowNumber][columnNumber] == (this.isPlayerOne ? PlayerEmojis[0] : PlayerEmojis[1])) {
			streak++;
		}

		return streak;
	}

	async win() {
		await this.message.removeReactions();
		await this.message.edit({
			content: `${this.isPlayerOne ? this.players[0] : this.players[1]} has won!`,
			embeds: [
				new MessageEmbed()
					.setColor(EmbedColor)
					.setDescription(`\n\n${this.grid.map((e) => e.join('')).join('\n')}`),
			]},
		);
	}
	async draw() {
		await this.message.removeReactions();
		await this.message.edit({
			content: `You drew!`,
			embeds: [
				new MessageEmbed()
					.setColor(EmbedColor)
					.setDescription(`\n\n${this.grid.map((e) => e.join('')).join('\n')}`),
			]},
		);
	}

	async updateMessage() {
		await this.message.edit({
			content: `${this.interaction.user} has challenged ${this.interaction.options.getUser('playertwo')} to a game of tic tac toe!`,
			embeds: [
				new MessageEmbed()
					.setColor(EmbedColor)
					.setDescription(`\nCurrent go: ${this.isPlayerOne ? PlayerEmojis[2] : PlayerEmojis[3]} ${this.currentPlayer}\n\n${this.grid.map((e) => e.join('')).join('\n')}`),
			]},
		);
	}
}
