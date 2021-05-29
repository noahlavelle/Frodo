"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hangman = void 0;
const index_1 = require("../../index");
const HangmanStages = [
    '___\n*      |\n*    \n*    \n*      \n*    \n*',
    '___\n*      |\n*    :dizzy_face: \n*      | \n*      \n*    \n*',
    '___\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      \n*    \n*',
    '___\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    \n*',
    '___\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    /\n*',
    '___\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    / \\\n*',
];
class Hangman {
    constructor(interaction) {
        this.displayWord = '';
        this.wrongGuesses = '';
        this.stage = 0;
        this.interaction = interaction;
        this.players = [interaction.user, index_1.client.users.cache.find((user) => user.id == interaction.options[0].value)];
        this.runGame();
    }
    async runGame() {
        if (this.players[1] == null || this.players[1].bot) {
            await this.interaction.reply('The player could not be found or was a bot');
            return;
        }
        let hasWon = false;
        await this.interaction.defer();
        await this.updateMessage('Waiting for a word to be chosen');
        await this.players[0].send('Choose a word');
        const dmFilter = (m) => {
            return true;
        };
        const channelFilter = (m) => {
            return m.author.id == this.players[0].id;
        };
        await this.players[0].dmChannel.awaitMessages(dmFilter, { max: 1 }).then(async (collected) => {
            this.word = collected.first().content;
            for (let i = 0; i < this.word.length; i++)
                this.displayWord += '-';
            await this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}`);
            await this.interaction.fetchReply().then((msg) => this.message = msg);
            const filter = (m) => {
                return this.message.author.id == this.players[1].id;
            };
        });
        while (!hasWon) {
            await this.message.channel.awaitMessages(channelFilter, { max: 1 }).then((collected) => {
                const letter = collected.first().content[0];
                collected.first().delete();
                if (this.word.includes(letter)) {
                    const displayWordArray = [...this.displayWord];
                    for (let i = 0; i < displayWordArray.length; i++) {
                        if (this.word[i] == letter) {
                            displayWordArray[i] = letter;
                        }
                    }
                    this.displayWord = displayWordArray.join('');
                }
                else {
                    if (this.wrongGuesses.includes(letter))
                        return;
                    this.wrongGuesses += letter;
                    this.stage++;
                }
                this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}`);
                if (this.displayWord == this.word) {
                    hasWon = true;
                    this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}\n${this.players[1]} has won!`);
                }
                else if (this.stage == HangmanStages.length - 1) {
                    hasWon = true;
                    this.updateMessage(`\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.wrongGuesses}\n${this.players[0]} has won!`);
                }
            });
        }
    }
    async updateMessage(attachment) {
        await this.interaction.editReply(`${HangmanStages[this.stage]}\n${attachment}`);
    }
}
exports.Hangman = Hangman;
//# sourceMappingURL=hangman.js.map