"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Akinator = void 0;
const aki_api_1 = require("aki-api");
const region = 'en';
const discord_js_1 = require("discord.js");
const utils_1 = require("./utils");
const NumberReactions = {
    '851065666341699584': 0,
    '851065679682469888': 1,
    '851065688436899861': 2,
    '851065697873690654': 3,
    '851065706735992893': 4,
    '851065718644801546': 5,
};
const NumberReactionsFilter = {
    'l1': 0,
    'l2': 1,
    'l3': 2,
    'l4': 3,
    'l5': 4,
    'l6': 5,
};
const LetterReactions = {
    '🇾': 0,
    '🇳': 1,
};
class Akinator {
    constructor(interaction) {
        this.interaction = interaction;
        this.aki = new aki_api_1.Aki(region);
        this.runGame();
    }
    async runGame() {
        await this.interaction.defer();
        this.message = await this.interaction.fetchReply();
        await this.aki.start();
        let hasWon = false;
        await this.updateMessage();
        for (const reaction of Object.keys(NumberReactions)) {
            await this.message.react(reaction);
        }
        const filter = (reaction, user) => {
            return Object.keys(NumberReactionsFilter).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
        };
        while (!hasWon) {
            await this.message.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] }).then(async (collected) => {
                const response = NumberReactionsFilter[collected.first().emoji.name];
                await utils_1.removeReaction(this.message, this.interaction.user);
                if (response == 5) {
                    await this.aki.back();
                }
                else {
                    await this.aki.step(response);
                }
                await this.updateMessage();
                if (this.aki.progress >= 75 || this.aki.currentStep >= 78) {
                    await this.aki.win();
                    hasWon = true;
                    await this.win();
                    return;
                }
            }).catch((err) => {
                hasWon = true;
                this.interaction.editReply('The game has timed out!');
                this.message.reactions.removeAll();
            });
        }
    }
    async win() {
        let choiceMade = false;
        await this.message.reactions.removeAll();
        const filter = (reaction, user) => {
            return Object.keys(LetterReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
        };
        await this.updateWinMessage('Am I right?', 0);
        for (const letter of Object.keys(LetterReactions)) {
            await this.message.react(letter);
        }
        for (let i = 0; i < this.aki.guessCount && !choiceMade; i++) {
            await this.updateWinMessage('Am I right?', i);
            await this.message.awaitReactions(filter, { max: 1 }).then(async (collected) => {
                await utils_1.removeReaction(this.message, this.interaction.user);
                if (collected.first().emoji.name == Object.keys(LetterReactions)[0]) {
                    await this.updateWinMessage('I win again!', i);
                    await this.message.reactions.removeAll();
                    choiceMade = true;
                }
            });
        }
    }
    async updateWinMessage(description, i) {
        await this.interaction.editReply(new discord_js_1.MessageEmbed()
            .setTitle('Akinator:')
            .setColor('#3498db')
            .addFields({ name: 'Name:', value: this.aki.answers[i].name }, { name: 'Description:', value: this.aki.answers[i].description })
            .setImage(this.aki.answers[i].absolute_picture_path)
            .setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png')
            .setDescription(description));
    }
    async updateMessage() {
        await this.interaction.editReply(new discord_js_1.MessageEmbed()
            .setTitle('Akinator:')
            .setColor('#3498db')
            .setThumbnail('https://frodo.fun/static/img/frodoAssets/aki.png')
            .addFields({ name: 'Question:', value: this.aki.question }, {
            name: 'Answers:',
            value: `\n1: ${this.aki.answers[0]}\n2: ${this.aki.answers[1]}\n3: ${this.aki.answers[2]}\n4: ${this.aki.answers[3]}\n5: ${this.aki.answers[4]}\n6: Back`,
        }, { name: 'Progress:', value: this.aki.progress }));
    }
}
exports.Akinator = Akinator;
//# sourceMappingURL=akinator.js.map