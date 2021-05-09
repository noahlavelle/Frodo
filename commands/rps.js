"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rps = void 0;
const index_1 = require("../index");
var WinScenario;
(function (WinScenario) {
    WinScenario[WinScenario["Tie"] = 0] = "Tie";
    WinScenario[WinScenario["PlayerOne"] = 1] = "PlayerOne";
    WinScenario[WinScenario["PlayerTwo"] = 2] = "PlayerTwo";
})(WinScenario || (WinScenario = {}));
const WinScenarios = {
    '🇷🇸': WinScenario.PlayerOne,
    '🇵🇷': WinScenario.PlayerOne,
    '🇸🇵': WinScenario.PlayerOne,
    '🇸🇷': WinScenario.PlayerTwo,
    '🇷🇵': WinScenario.PlayerTwo,
    'p🇸': WinScenario.PlayerTwo,
    '🇷🇷': WinScenario.Tie,
    '🇵🇵': WinScenario.Tie,
    '🇸🇸': WinScenario.Tie,
};
const LetterReactions = ['🇷', '🇵', '🇸'];
class Rps {
    constructor(interaction) {
        this.interaction = interaction;
        this.players = [interaction.user, index_1.client.users.cache.find((user) => user.id == interaction.options[0].value)];
        this.runGame();
    }
    async runGame() {
        if (this.players[1] == null || this.players[1].bot) {
            await this.interaction.reply('The player could not be found or was a bot');
            return;
        }
        await this.interaction.reply(`${this.players[0]} has challenged ${this.players[1]} to a game of rock paper scissors.`);
        await this.interaction.fetchReply().then((msg) => this.message = msg);
        const playerOneMessage = await this.players[0].send(`Choose rock, paper or scissors`);
        const playerTwoMessage = await this.players[1].send(`Choose rock, paper or scissors`);
        for (const letter of LetterReactions) {
            await Promise.all([playerOneMessage.react(letter), playerTwoMessage.react(letter)]);
        }
        const filter = (reaction, user) => {
            return LetterReactions.includes(reaction.emoji.name);
        };
        const playerOneAwait = playerOneMessage.awaitReactions(filter, { max: 1 });
        const playerTwoAwait = playerTwoMessage.awaitReactions(filter, { max: 1 });
        await Promise.all([playerOneAwait, playerTwoAwait]).then((values) => {
            const winScenario = WinScenarios[values[0].keyArray()[0] + values[1].keyArray()[0]];
            this.message.edit(`${winScenario == WinScenario.PlayerOne ? this.players[0] : this.players[1]} has ${winScenario == WinScenario.Tie ? 'tied with' : 'beaten'} ${''}${winScenario == WinScenario.PlayerOne ? this.players[1] : this.players[0]} at a game of rock paper scissors`);
        });
    }
}
exports.Rps = Rps;
//# sourceMappingURL=rps.js.map