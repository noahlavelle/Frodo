"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectFour = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const utils_1 = require("./utils");
var SlotType;
(function (SlotType) {
    SlotType[SlotType["Empty"] = 0] = "Empty";
    SlotType[SlotType["PlayerOne"] = 1] = "PlayerOne";
    SlotType[SlotType["PlayerTwo"] = 2] = "PlayerTwo";
})(SlotType || (SlotType = {}));
const GridDimensions = {
    x: 7,
    y: 7,
};
const SlotText = {
    0: '<:wr:852255175258275841>',
    1: '<:c1:852258262052765706>',
    2: '<:c2:852258272945242172>',
};
const PlayerTextClear = {
    0: '<:c1c:852259321134841876>',
    1: '<:c2c:852259332053008384>',
};
const NumberReactions = {
    '851065666341699584': 0,
    '851065679682469888': 1,
    '851065688436899861': 2,
    '851065697873690654': 3,
    '851065706735992893': 4,
    '851065718644801546': 5,
    '851065729570963456': 6,
};
const NumberReactionsFilter = {
    'l1': 1,
    'l2': 2,
    'l3': 3,
    'l4': 4,
    'l5': 5,
    'l6': 6,
    'l7': 7,
};
class ConnectFour {
    constructor(interaction) {
        this.interaction = interaction;
        if (Math.round(Math.random()) === 0) {
            this.players = [this.interaction.user, this.interaction.options.getUser('playertwo')];
        }
        else {
            this.players = [this.interaction.options.getUser('playertwo'), this.interaction.user];
        }
        ;
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
        await this.interaction.deferReply();
        this.message = await utils_1.getMessage(this.interaction);
        this.generateGrid();
        this.updateMessage(true);
        for (const value of Object.keys(NumberReactions)) {
            await this.message.react(value);
        }
        const filter = (reaction, user) => {
            return Object.keys(NumberReactionsFilter).includes(reaction.emoji.name) && this.currentPlayer == user;
        };
        while (true) {
            await this.message.awaitReactions({ filter, max: 1 })
                .then(async (collected) => {
                const reaction = collected.first();
                const columnNumber = NumberReactionsFilter[reaction.emoji.name] - 1;
                let rowNumber = GridDimensions.y - 1;
                await utils_1.removeReaction(this.message, this.currentPlayer);
                for (let i = GridDimensions.y - 1; i >= 0; i--) {
                    if (this.grid[i][columnNumber] == SlotType.Empty) {
                        this.grid[i][columnNumber] = this.isPlayerOne ? SlotType.PlayerOne : SlotType.PlayerTwo;
                        this.updateMessage();
                        break;
                    }
                    rowNumber--;
                }
                let isWin = false;
                try {
                    isWin = this.checkHorizontalWin(rowNumber);
                    if (!isWin) {
                        isWin = this.checkVerticalWin(columnNumber);
                        if (!isWin) {
                            isWin = this.checkDiagonalWin(columnNumber, rowNumber, true);
                            if (!isWin)
                                isWin = this.checkDiagonalWin(columnNumber, rowNumber, false);
                        }
                    }
                }
                catch (IndexOutOfRangeException) {
                    return;
                }
                if (isWin) {
                    this.win();
                }
                this.isPlayerOne = !this.isPlayerOne;
                this.currentPlayer = this.isPlayerOne ? this.players[0] : this.players[1];
            });
        }
    }
    generateGrid() {
        for (let i = 0; i < GridDimensions.y; i++) {
            for (let j = 0; j < GridDimensions.x; j++) {
                if (!this.grid[i])
                    this.grid.push([]);
                this.grid[i].push(SlotType.Empty);
            }
        }
    }
    updateMessage(start) {
        let message = '';
        this.grid.forEach((i) => {
            i.forEach((j) => {
                message += SlotText[j];
            });
            message += '\n';
        });
        message += '<:l1:851065666341699584><:l2:851065679682469888><:l3:851065688436899861><:l4:851065697873690654><:l5:851065706735992893><:l6:851065718644801546><:l7:851065729570963456>';
        start ? this.interaction.editReply({
            content: `<@${this.interaction.user.id}> challenged ${this.interaction.options.getUser('playertwo')} to a game of Connect Four!`,
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setDescription(`Current go: ${PlayerTextClear[this.isPlayerOne ? 0 : 1]} ${this.isPlayerOne ? this.players[0] : this.players[1]}\n\n${message}`),
            ]
        }) : this.interaction.editReply({
            content: `<@${this.interaction.user.id}> challenged ${this.interaction.options.getUser('playertwo')} to a game of Connect Four!`,
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setDescription(`Current go: ${PlayerTextClear[this.isPlayerOne ? 1 : 0]} ${this.isPlayerOne ? this.players[1] : this.players[0]}\n\n${message}`),
            ]
        });
    }
    checkHorizontalWin(row) {
        let streak = 0;
        for (let i = 0; i < GridDimensions.x; i++) {
            if (this.grid[row][i] == SlotType.PlayerOne && this.isPlayerOne ||
                this.grid[row][i] == SlotType.PlayerTwo && !this.isPlayerOne) {
                streak++;
                if (streak == 4)
                    return true;
            }
            else {
                streak = 0;
            }
        }
        return false;
    }
    checkVerticalWin(column) {
        let streak = 0;
        for (let i = 0; i < GridDimensions.y; i++) {
            if (this.grid[i][column] == SlotType.PlayerOne && this.isPlayerOne ||
                this.grid[i][column] == SlotType.PlayerTwo && !this.isPlayerOne) {
                streak++;
                if (streak == 4)
                    return true;
            }
            else {
                streak = 0;
            }
        }
        return false;
    }
    checkDiagonalWin(column, row, isRight) {
        const diagonal = [];
        try {
            while (true) {
                const gridSlot = this.grid[row][column];
                column = isRight ? column - 1 : column + 1;
                row++;
            }
        }
        catch {
            column = isRight ? column + 1 : column - 1;
            row--;
        }
        try {
            let streak = 0;
            while (true) {
                if (this.grid[row][column] == SlotType.PlayerOne && this.isPlayerOne ||
                    this.grid[row][column] == SlotType.PlayerTwo && !this.isPlayerOne) {
                    streak++;
                    if (streak == 4)
                        return true;
                }
                else {
                    streak = 0;
                }
                row--;
                column = isRight ? column + 1 : column - 1;
            }
        }
        catch { }
        return false;
    }
    async win() {
        await this.message.reactions.removeAll();
        await this.interaction.editReply(this.message.content += `\n\n<@${this.currentPlayer.id}> wins!`);
        this.updateMessageWin();
    }
    updateMessageWin() {
        let message = '';
        this.grid.forEach((i) => {
            i.forEach((j) => {
                message += SlotText[j];
            });
            message += '\n';
        });
        message += '<:l1:851065666341699584><:l2:851065679682469888><:l3:851065688436899861><:l4:851065697873690654><:l5:851065706735992893><:l6:851065718644801546><:l7:851065729570963456>';
        this.interaction.editReply({
            content: `<@${this.interaction.user.id}> challenged ${this.interaction.options.getUser('playertwo')} to a game of Connect Four!\n\n${this.isPlayerOne ? this.players[1] : this.players[0]} Won!\n`,
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setDescription(`\n${message}`),
            ]
        });
    }
}
exports.ConnectFour = ConnectFour;
//# sourceMappingURL=connectFour.js.map