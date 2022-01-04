// import {CommandInteraction, Message, MessageEmbed, User} from 'discord.js';
// import {Card, Deck} from '../../deck';
// import {getMessage} from '../../utils';
// import handleError from '../../utilFunctions';
// import {EmbedColor} from '../../index';
//
// export class Rummy {
// 	interaction: CommandInteraction;
// 	deck: Deck;
// 	players: User[];
// 	handMessages: Message[][];
// 	hands: Card[][];
// 	pile: Card[];
// 	message: Message;
// 	sent: boolean;
//
// 	constructor(interaction) {
// 		this.sent = false;
// 		this.interaction = interaction;
//
// 		if (Math.round(Math.random()) === 0) {
// 			this.players = [this.interaction.user, this.interaction.options.getUser('playertwo')];
// 		} else {
// 			this.players = [this.interaction.options.getUser('playertwo'), this.interaction.user];
// 		};
//
// 		try {
// 			this.runGame();
// 		} catch (e) {
// 			handleError(e, this.interaction);
// 		}
// 	}
//
// 	async runGame() {
// 		await this.interaction.reply(`${this.interaction.user} has challenged ${this.interaction.options.getUser('playertwo')} to a game of Rummy, Please move to DMs`);
// 		this.message = await getMessage(this.interaction);
//
// 		this.deck = new Deck();
// 		await this.deck.init();
//
// 		const embed = new MessageEmbed()
// 			.setDescription('Loading your game...');
//
// 		this.handMessages = [[await this.players[0].send({embeds: [embed]})], [await this.players[1].send({embeds: [embed]})]];
//
// 		this.hands = [await this.deck.draw(10), await this.deck.draw(10)];
// 		this.pile = await this.deck.draw();
//
// 		await this.updateDmMessages();
// 	}
//
// 	async updateDmMessages() {
// 		for (const player of this.players) {
// 			const index = this.players.indexOf(player);
// 			const otherPlayer = this.players[(index + 1) % 2];
//
// 			await this.handMessages[index][0].edit({
// 				embeds: [
// 					new MessageEmbed()
// 						.setTitle(`Rummy game against ${otherPlayer.username}`)
// 						.setDescription('Hand:')
// 						.setColor(EmbedColor),
// 				],
// 			});
// 			if (this.sent) {
// 				await this.handMessages[index][1].edit(this.hands[index].map((card) => card.emoji).join(''));
// 				await this.handMessages[index][2].edit({
// 					embeds: [
// 						new MessageEmbed()
// 							.setDescription('Current Table:')
// 							.setColor(EmbedColor),
// 					],
// 				});
// 				await this.handMessages[index][3].edit(this.pile[0].emoji + this.deck.backEmoji);
// 				await this.handMessages[index][4].edit({
// 					embeds: [
// 						new MessageEmbed()
// 							.setDescription(`${otherPlayer.username}'s hand:`)
// 							.setColor(EmbedColor),
// 					],
// 				});
// 				await this.handMessages[index][5].edit(this.hands[(index + 1) % 2].map(() => this.deck.backEmoji).join(''));
// 			} else {
// 				this.handMessages[index][1] = await player.send(this.hands[index].map((card) => card.emoji).join(''));
// 				this.handMessages[index][2] = await player.send({
// 					embeds: [
// 						new MessageEmbed()
// 							.setDescription('Current Table:')
// 							.setColor(EmbedColor),
// 					],
// 				});
// 				this.handMessages[index][3] = await player.send(this.pile[0].emoji + this.deck.backEmoji);
// 				this.handMessages[index][4] = await player.send({
// 					embeds: [
// 						new MessageEmbed()
// 							.setDescription(`${otherPlayer.username}'s hand:`)
// 							.setColor(EmbedColor),
// 					],
// 				});
// 				this.handMessages[index][5] = await player.send(this.hands[(index + 1) % 2].map(() => this.deck.backEmoji).join(''));
// 			}
// 		}
//
// 		return;
// 	}
// }
