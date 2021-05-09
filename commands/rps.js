"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    runGame() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.players[1] == null || this.players[1].bot) {
                yield this.interaction.reply('The player could not be found or was a bot');
                return;
            }
            yield this.interaction.reply(`${this.players[0]} has challenged ${this.players[1]} to a game of rock paper scissors.`);
            yield this.interaction.fetchReply().then((msg) => this.message = msg);
            const playerOneMessage = yield this.players[0].send(`Choose rock, paper or scissors`);
            const playerTwoMessage = yield this.players[1].send(`Choose rock, paper or scissors`);
            for (const letter of LetterReactions) {
                yield Promise.all([playerOneMessage.react(letter), playerTwoMessage.react(letter)]);
            }
            const filter = (reaction, user) => {
                return LetterReactions.includes(reaction.emoji.name);
            };
            const playerOneAwait = playerOneMessage.awaitReactions(filter, { max: 1 });
            const playerTwoAwait = playerTwoMessage.awaitReactions(filter, { max: 1 });
            yield Promise.all([playerOneAwait, playerTwoAwait]).then((values) => {
                const winScenario = WinScenarios[values[0].keyArray()[0] + values[1].keyArray()[0]];
                this.message.edit(`${winScenario == WinScenario.PlayerOne ? this.players[0] : this.players[1]} has ${winScenario == WinScenario.Tie ? 'tied with' : 'beaten'} ${''}${winScenario == WinScenario.PlayerOne ? this.players[1] : this.players[0]} at a game of rock paper scissors`);
            });
        });
    }
}
exports.Rps = Rps;
//# sourceMappingURL=rps.js.map