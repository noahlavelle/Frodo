import {
	CommandInteraction,
	Message,
	MessageEmbed,
	MessageReaction,
	ReactionEmoji,
	Role,
	TextChannel,
	User,
} from 'discord.js';
import {PartyLobby} from '../../partyLobby';
import {EmbedColor} from '../../index';

enum Roles {
	Seer,
	Doctor,
	Werewolf,
	Villager,
}
const selectionReactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const wait = require('util').promisify(setTimeout);
const roleStack = [Roles.Werewolf];

export class Werewolf extends PartyLobby {
	interaction: CommandInteraction;
	players: User[];
	playerRoles: any[][];
	generalChannel: TextChannel;
	werewolvesChannel: TextChannel;
	werewolves: User[];
	gameRunning = true;

	constructor(interaction) {
		super(interaction, 'Werewolf', '**Werewolf** is a classic social deduction party game. ' +
			'Press the blue button to join and the red button to leave. The minimum number of players are 2', 2);

		this.interaction = interaction;
		this.playerRoles = [];
		this.werewolves = [];
	}

	async gameStarted(players: User[]) {
		super.gameStarted(players);
		this.players = players;

		for (const role of roleStack) {
			const randomIndex = Math.floor(Math.random() * players.length);
			this.playerRoles.push([this.players[randomIndex], role]);
			if (role == Roles.Werewolf) this.werewolves.push(this.players[randomIndex]);
			this.players.splice(randomIndex, 1);
		}

		for (const user of this.players) {
			this.playerRoles.push([user, Roles.Villager]);
		}

		this.players = players;
		await this.createChannels();

		while (this.gameRunning) {
			await this.sendNightMessages();
			const werewolvesFilter = (msg: Message) => {
				return msg.content.split(' ').length == 1 && msg.mentions.users.size == 1 && !this.werewolves.includes(msg.mentions.users.first());
			};
			const generalFilter = (msg: Message) => {
				return msg.content.split(' ').length == 1 && msg.mentions.users.size == 1;
			};

			const werewolvesVictimIndex = await this.runVictimSelection(15000, true);
			await this.sendDayMessages(this.playerRoles[werewolvesVictimIndex][0]);
			const villagersVictimIndex = await this.runVictimSelection(15000, false);
			await this.generalChannel.send(`${this.playerRoles[villagersVictimIndex][0]} was successfully killed.`);
		}
	}

	async runVictimSelection(voteTime: number, isWerewolvesVote: boolean) {
		let victimDescription = '';
		const identifiers = [];
		let actualIndex = 0;
		this.playerRoles.forEach((data) => {
			if (!isWerewolvesVote || (!this.werewolves.includes(data[0]) && isWerewolvesVote)) {
				victimDescription += `${selectionReactions[actualIndex]}: ${data[0].username}\n`;
				identifiers.push(selectionReactions[actualIndex]);
			} else {
				actualIndex -= 1;
			}

			actualIndex ++;
		});

		const victimEmbed = new MessageEmbed()
			.setTitle('Chose Victim:')
			.setColor(EmbedColor)
			.setDescription(victimDescription + `\nYou now have ${Math.round(voteTime / 60000)} minute(s) to decide. At the end of the time the most voted player will be killed, but if it is a draw nobody will die`);
		const victimSelectionMessage = isWerewolvesVote ? await this.werewolvesChannel.send({embeds: [victimEmbed]}) : await this.generalChannel.send({embeds: [victimEmbed]});
		for (const identifier of identifiers) {
			await victimSelectionMessage.react(identifier);
		}

		let selectedUserIndex = 0;
		await sleep(voteTime);
		let leadingReaction = ['', 0];
		victimSelectionMessage.reactions.cache.forEach((reaction) => {
			if (reaction.count > leadingReaction[1]) {
				leadingReaction = [reaction.emoji.name, reaction.count];
			}
		});

		selectionReactions.forEach((emoji: string, i: number) => {
			if (leadingReaction[0] == emoji) {
				selectedUserIndex = i;
				return;
			}
		});

		return selectedUserIndex;
	}

	async checkWin() {
		let werewolfCount = 0;
		let villagerCount = 0;
		for (const playerRole of this.playerRoles) {
			if (playerRole[1] == Roles.Werewolf) {
				werewolfCount++;
			} else {
				villagerCount++;
			}
		}

		if (werewolfCount >= villagerCount) {
			await this.endGame(true);
		} else if (werewolfCount == 0) {
			await this.endGame(false);
		}
	}

	async endGame(hasWerewolvesWon: boolean) {
		await this.werewolvesChannel.delete();
		await this.generalChannel.delete();
		await this.message.channel.send(`The game of werewolf has ended. The winners are the ${hasWerewolvesWon ? 'werewolves' : 'villagers'}!`);
		this.gameRunning = false;
	}

	async killPlayer(player: User) {
		await this.generalChannel.permissionOverwrites.edit(player.id, {SEND_MESSAGES: false});
		await this.werewolvesChannel.permissionOverwrites.edit(player.id, {SEND_MESSAGES: false});
		this.players.splice(this.players.indexOf(player));
		await this.checkWin();
	}

	async sendDayMessages(victim: User) {
		await this.generalChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Day Time:')
				.setDescription(`As dawn breaks you discover the dead body of ${victim}. It is your job to decide who to kill`)
				.setColor(EmbedColor),
		]});
		await this.werewolvesChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Day Time:')
				.setDescription(`${victim} was successfully killed, and now you need to go to the ${this.generalChannel} to convince the villagers you are innocent`)
				.setColor(EmbedColor),
		]});
	}

	async sendNightMessages() {
		await this.generalChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Night Time:')
				.setDescription('The werewolves will now decide who to kill. If you have a special role you will be DMd when you need to make a choice')
				.setColor(EmbedColor),
		]});
		await this.werewolvesChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Night Time:')
				.setDescription('You need to choose who to kill. When you have chosen who to kill just mention them in an empty message')
				.setColor(EmbedColor),
		]});
	}

	async createChannels() {
		const werewolvesPermissionOverride = [];
		const generalPermissionsOverride = [];
		werewolvesPermissionOverride.push({
			id: this.interaction.guild.roles.everyone,
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		});
		generalPermissionsOverride.push({
			id: this.interaction.guild.roles.everyone,
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		});

		for (const playerRole of this.playerRoles) {
			if (playerRole[1] == Roles.Werewolf) {
				werewolvesPermissionOverride.push({
					id: playerRole[0].id,
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
				});
			}

			generalPermissionsOverride.push({
				id: playerRole[0].id,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
			});
		}

		this.generalChannel = await this.interaction.guild.channels.create('Werewolf - General', {
			type: 'GUILD_TEXT',
			permissionOverwrites: generalPermissionsOverride,
		});
		this.werewolvesChannel = await this.interaction.guild.channels.create('Werewolf - Werewolves', {
			type: 'GUILD_TEXT',
			permissionOverwrites: werewolvesPermissionOverride,
		});

		await this.generalChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Werewolf')
				.setDescription('Welcome to Werewolf. This is the channel for everyone, so keep your role here secret. If you have a special role like seer or doctor you will be ' +
					'DMd. Werewolves have a private channel that villagers cannot see.')
				.setColor(EmbedColor),
		]});

		await this.werewolvesChannel.send({embeds: [
			new MessageEmbed()
				.setTitle('Werewolf')
				.setDescription('Welcome to werewolf. You are all werewolves and your goal is to kill all the villagers')
				.setColor(EmbedColor),
		]});
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
