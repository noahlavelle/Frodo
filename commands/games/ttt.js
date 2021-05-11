"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ttt = void 0;
const index_1 = require("../../index");
const NumberReactions = {
    '1️⃣': 1,
    '2️⃣': 2,
    '3️⃣': 3,
    '4️⃣': 4,
    '5️⃣': 5,
    '6️⃣': 6,
    '7️⃣': 7,
    '8️⃣': 8,
    '9️⃣': 9,
};
class Ttt {
    constructor(interaction) {
        this.interaction = interaction;
        this.players = [this.interaction.user, index_1.client.users.cache.find((user) => user.id == interaction.options[0].value)];
        this.currentPlayer = this.players[0];
        this.isPlayerOne = true;
        this.grid = [];
        this.runGame();
    }
    async runGame() {
        if (this.players[1] == null || this.players[1].bot) {
            await this.interaction.reply('The player could not be found or was a bot');
            return;
        }
        let hasWon = false;
        await this.interaction.defer();
        await this.interaction.fetchReply().then((msg) => this.message = msg);
        for (let i = 0; i < 3; i++) {
            this.grid.push([]);
            for (let j = 0; j < 3; j++) {
                this.grid[i].push(':white_large_square:');
            }
        }
        await this.updateMessage();
        for (const reaction of Object.keys(NumberReactions)) {
            await this.message.react(reaction);
        }
        const filter = (reaction, user) => {
            return Object.keys(NumberReactions).includes(reaction.emoji.name) && this.currentPlayer.id == user.id;
        };
        while (!hasWon) {
            await this.message.awaitReactions(filter, { max: 1 }).then(async (collected) => {
                const selectedNumber = NumberReactions[collected.first().emoji.name];
                const userReactions = this.message.reactions.cache.filter((reaction) => reaction.users.cache.has(this.currentPlayer.id));
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(this.currentPlayer.id);
                }
                const rowNumber = Math.ceil(selectedNumber / 3) - 1;
                const columnNumber = (selectedNumber - (rowNumber * 3)) - 1;
                if (this.grid[rowNumber][columnNumber] != ':white_large_square:')
                    return;
                this.grid[rowNumber][columnNumber] = this.isPlayerOne ? ':regional_indicator_o:' : ':regional_indicator_x:';
                let isWin;
                isWin = this.checkHorizontalWin(rowNumber);
                isWin = !isWin ? this.checkVerticalWin(columnNumber) : isWin;
                isWin = !isWin ? this.checkDiagonalWin(true) : isWin;
                isWin = !isWin ? this.checkDiagonalWin(false) : isWin;
                if (isWin) {
                    await this.win();
                    hasWon = true;
                }
                this.isPlayerOne = !this.isPlayerOne;
                this.currentPlayer = this.isPlayerOne ? this.players[0] : this.players[1];
                await this.updateMessage();
            });
        }
    }
    checkHorizontalWin(rowNumber) {
        let streak = 0;
        for (let i = 0; i < 3; i++) {
            if (this.grid[rowNumber][i] == (this.isPlayerOne ? ':regional_indicator_o:' : ':regional_indicator_x:')) {
                streak++;
                if (streak == 3) {
                    return true;
                }
            }
        }
    }
    checkVerticalWin(columnNumber) {
        let streak = 0;
        for (let i = columnNumber; i < 9; i += 3) {
            streak = this.checkIfWin(i, streak);
            if (streak == 3)
                return true;
        }
    }
    checkDiagonalWin(isTop) {
        const columnNumber = isTop ? 0 : 3;
        const rowNumber = isTop ? 0 : 3;
        let streak = 0;
        for (let i = (rowNumber * 3) + columnNumber; i < 9; isTop ? i += 4 : i -= 4) {
            streak = this.checkIfWin(i, streak);
            if (streak == 3)
                return true;
        }
    }
    checkIfWin(i, streak) {
        const rowNumber = Math.ceil((i + 1) / 3) - 1;
        const columnNumber = (i - (rowNumber * 3));
        if (this.grid[rowNumber][columnNumber] == (this.isPlayerOne ? ':regional_indicator_o:' : ':regional_indicator_x:')) {
            streak++;
        }
        return streak;
    }
    async win() {
        await this.message.reactions.removeAll();
        await this.interaction.fetchReply().then((msg) => this.message = msg);
        await this.interaction.editReply(this.message.content + `\n\n${this.isPlayerOne ? this.players[0] : this.players[1]} has won!`);
    }
    async updateMessage() {
        await this.interaction.editReply(`${this.players[0]} has challenged ${this.players[1]} to a game of oxo.\nCurrent go: ${this.isPlayerOne ? ':regional_indicator_o:' : ':regional_indicator_x:'} ${this.players[0]}\n\n${this.grid.map((e) => e.join('')).join('\n')}`);
    }
}
exports.Ttt = Ttt;
//# sourceMappingURL=ttt.js.map