"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rps = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const utils_1 = require("./utils");
var WinScenario;
(function (WinScenario) {
    WinScenario[WinScenario["Tie"] = 0] = "Tie";
    WinScenario[WinScenario["PlayerOne"] = 1] = "PlayerOne";
    WinScenario[WinScenario["PlayerTwo"] = 2] = "PlayerTwo";
})(WinScenario || (WinScenario = {}));
const WinScenarios = {
    'rpsrrpss': WinScenario.PlayerOne,
    'rpsprpsr': WinScenario.PlayerOne,
    'rpssrpsp': WinScenario.PlayerOne,
    'rpssrpsr': WinScenario.PlayerTwo,
    'rpsrrpsp': WinScenario.PlayerTwo,
    'rpsprpss': WinScenario.PlayerTwo,
    'rpsrrpsr': WinScenario.Tie,
    'rpsprpsp': WinScenario.Tie,
    'rpssrpss': WinScenario.Tie,
};
const LetterReactions = [
    '856205202994626580',
    '856205203011272715',
    '856205203128582214',
];
const LetterReactionsFilter = [
    'rpsr',
    'rpsp',
    'rpss',
];
function embed(text, color) {
    return new discord_js_1.MessageEmbed()
        .setColor(color || index_1.EmbedColor)
        .setDescription(text);
}
;
class Rps {
    constructor(interaction) {
        this.interaction = interaction;
        this.players = [interaction.user, index_1.client.users.cache.find((user) => user.id == interaction.options[0].value)];
        this.runGame();
    }
    async runGame() {
        try {
            if (this.players[1] == null || this.players[1].bot)
                return this.interaction.reply('The player could not be found or was a bot');
            await this.interaction.reply(embed(`${this.players[0]} has challenged ${this.players[1]} to a game of rock paper scissors.\nPlease move to DMs`));
            this.message = await this.interaction.fetchReply();
            const playerOneMessage = await this.players[0].send('', {
                embed: embed(`You challenged ${this.players[1].username} to Rock Paper Scissors [here](https://discordapp.com/channels/${this.message.guild.id}/${this.message.channel.id}/${this.message.id})\nChoose rock, paper or scissors`),
            });
            const playerTwoMessage = await this.players[1].send('', {
                embed: embed(`${this.players[0].username} challenged you to Rock Paper Scissors [here](https://discordapp.com/channels/${this.message.guild.id}/${this.message.channel.id}/${this.message.id})\nChoose rock, paper or scissors`),
            });
            for (const letter of LetterReactions) {
                await Promise.all([playerOneMessage.react(letter), playerTwoMessage.react(letter)]);
            }
            const filter = (reaction) => LetterReactionsFilter.includes(reaction.emoji.name);
            playerOneMessage.awaitReactions(filter, {
                max: 1,
                time: 300000,
                errors: ['time'],
            }).then(() => utils_1.removeReaction(playerOneMessage, this.message.author));
            playerTwoMessage.awaitReactions(filter, {
                max: 1,
                time: 300000,
                errors: ['time'],
            }).then(() => utils_1.removeReaction(playerTwoMessage, this.message.author));
            const playerOneAwait = playerOneMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] });
            const playerTwoAwait = playerTwoMessage.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] });
            await Promise.all([playerOneAwait, playerTwoAwait]).then((values) => {
                const winScenario = WinScenarios[values[0].first().emoji.name + values[1].first().emoji.name];
                this.message.edit(embed(`${winScenario === WinScenario.PlayerOne ? this.players[0] : this.players[1]} has ${winScenario == WinScenario.Tie ? 'tied with' : 'beaten'} ${winScenario == WinScenario.PlayerOne ? this.players[1] : this.players[0]} at a game of rock paper scissors`));
                if (winScenario === WinScenario.PlayerOne) {
                    playerOneMessage.edit(embed(`You beat ${this.players[1].username}`));
                    playerTwoMessage.edit(embed(`${this.players[0].username} beat you!`));
                }
                else if (winScenario === WinScenario.PlayerTwo) {
                    playerOneMessage.edit(embed(`${this.players[1].username} beat you!`));
                    playerTwoMessage.edit(embed(`You beat ${this.players[0].username}`));
                }
                else {
                    playerOneMessage.edit(embed(`You drew against ${this.players[1].username}!`));
                    playerTwoMessage.edit(embed(`You drew against ${this.players[0].username}!`));
                }
                ;
            });
        }
        catch (err) {
            return this.message.edit(embed('The game has timed out!', '#ff0000'));
        }
        ;
    }
}
exports.Rps = Rps;
//# sourceMappingURL=rps.js.map