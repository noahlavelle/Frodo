"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const partyLobby_1 = require("../../partyLobby");
var Roles;
(function (Roles) {
    Roles[Roles["Seer"] = 0] = "Seer";
    Roles[Roles["Doctor"] = 1] = "Doctor";
    Roles[Roles["Werewolf"] = 2] = "Werewolf";
    Roles[Roles["Villager"] = 3] = "Villager";
})(Roles || (Roles = {}));
const selectionReactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const roleStack = [Roles.Werewolf];
class Werewolf extends partyLobby_1.PartyLobby {
    constructor(interaction) {
        super(interaction, 'Werewolf', '**Werewolf** is a classic social deduction party game. ' +
            'Press the blue button to join and the red button to leave. The minimum number of players are 2', 2);
        this.interaction = interaction;
    }
    async gameStarted(players) {
        super.gameStarted(players);
        this.assignRoles(players);
        await this.createChannels();
    }
    assignRoles(players) {
        this.players = players;
        for (const role of roleStack) {
            const randomIndex = Math.floor(Math.random() * players.length);
            this.playerRoles.push([this.players[randomIndex], role]);
            if (role == Roles.Werewolf)
                this.werewolves.push(this.players[randomIndex]);
            this.players.splice(randomIndex, 1);
        }
        for (const user of this.players) {
            this.playerRoles.push([user, Roles.Villager]);
        }
        this.players = players;
    }
    async createChannels() {
        this.interaction.guild.channels.create('new-channel', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: this.interaction.guild.roles.everyone,
                    deny: [discord_js_1.Permissions.FLAGS.VIEW_CHANNEL],
                },
            ],
        });
    }
}
exports.default = Werewolf;
//# sourceMappingURL=werewolf.js.map