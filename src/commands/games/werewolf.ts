// import {CommandInteraction, Permissions, User} from 'discord.js';
// import {PartyLobby} from '../../partyLobby';
// import handleError from '../../utilFunctions';
//
// enum Roles {
// 	Seer,
// 	Doctor,
// 	Werewolf,
// 	Villager,
// }
// const selectionReactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
// const roleStack = [Roles.Werewolf];
//
// export default class Werewolf extends PartyLobby {
// 	interaction: CommandInteraction;
//
// 	/* Player Data */
// 	players: User[];
// 	playerRoles: any[][];
// 	werewolves: User[];
//
// 	constructor(interaction: CommandInteraction) {
// 		super(interaction, 'Werewolf', '**Werewolf** is a classic social deduction party game. ' +
// 			'Press the blue button to join and the red button to leave. The minimum number of players are 2', 2);
//
// 		this.interaction = interaction;
// 	}
//
// 	async gameStarted(players: User[]) {
// 		try {
// 			super.gameStarted(players);
// 			this.assignRoles(players);
// 			this.createChannels();
// 		} catch (e) {
// 			handleError(e, this.interaction);
// 		}
// 	}
//
// 	assignRoles(players: User[]) {
// 		this.players = players;
//
// 		for (const role of roleStack) {
// 			const randomIndex = Math.floor(Math.random() * players.length);
// 			this.playerRoles.push([this.players[randomIndex], role]);
// 			if (role == Roles.Werewolf) this.werewolves.push(this.players[randomIndex]);
// 			this.players.splice(randomIndex, 1);
// 		}
//
// 		for (const user of this.players) {
// 			this.playerRoles.push([user, Roles.Villager]);
// 		}
//
// 		this.players = players;
// 	}
//
// 	async createChannels() {
// 		this.interaction.guild.channels.create('new-channel', {
// 			type: 'GUILD_TEXT',
// 			permissionOverwrites: [
// 				{
// 					id: this.interaction.guild.roles.everyone,
// 					deny: [Permissions.FLAGS.VIEW_CHANNEL],
// 				},
// 			],
// 		});
// 	}
// }
