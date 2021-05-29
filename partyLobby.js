"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyLobby = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("./commands/games/utils");
class PartyLobby {
    constructor(interaction, title, description, minimumPlayers) {
        this.buttonReactions = {
            '🔵': 0,
            '🔴': 1,
            '🟢': 2,
        };
        this.interaction = interaction;
        this.minimumPlayers = minimumPlayers;
        this.title = title;
        this.players = [this.interaction.user];
        this.description = description;
        this.createLobby();
    }
    async createLobby() {
        await this.interaction.defer();
        await this.interaction.fetchReply().then((message) => this.message = message);
        await this.updateMessage();
        for (let i = 0; i < 2; i++) {
            await this.message.react(Object.keys(this.buttonReactions)[i]);
        }
        const filter = (reaction, user) => {
            return Object.keys(this.buttonReactions).includes(reaction.emoji.name);
        };
        const collector = this.message.createReactionCollector(filter);
        collector.on('collect', async (reaction, user) => {
            if (user.bot)
                return;
            await utils_1.removeReaction(this.message, user);
            switch (this.buttonReactions[reaction.emoji.name]) {
                case 0:
                    if (this.players.includes(user))
                        return;
                    this.players.push(user);
                    console.log('User added');
                    break;
                case 1:
                    const index = this.players.indexOf(user);
                    if (index == -1)
                        return;
                    this.players.splice(index, 1);
                    console.log('User Removed');
                    break;
                case 2:
                    if (user.id != this.interaction.user.id)
                        return;
                    this.gameStarted(this.players);
                    break;
            }
            await this.updateMessage();
            if (this.players.length == this.minimumPlayers) {
                await this.message.react(Object.keys(this.buttonReactions)[2]);
            }
        });
    }
    gameStarted(players) {
    }
    async updateMessage() {
        await this.interaction.editReply('', new discord_js_1.MessageEmbed()
            .setTitle(this.title)
            .setDescription(this.description)
            .addFields({ name: 'Player Count:', value: this.players.length })
            .setColor('#3498db'));
    }
}
exports.PartyLobby = PartyLobby;
//# sourceMappingURL=partyLobby.js.map