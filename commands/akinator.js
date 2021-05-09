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
exports.Akinator = void 0;
const aki_api_1 = require("aki-api");
const region = 'en';
const discord_js_1 = require("discord.js");
const NumberReactions = {
    '1️⃣': 0,
    '2️⃣': 1,
    '3️⃣': 2,
    '4️⃣': 3,
    '5️⃣': 4,
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
    runGame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.interaction.defer();
            yield this.interaction.fetchReply().then((msg) => this.message = msg);
            yield this.aki.start();
            let hasWon = false;
            yield this.updateMessage();
            for (const reaction of Object.keys(NumberReactions)) {
                yield this.message.react(reaction);
            }
            const filter = (reaction, user) => {
                return Object.keys(NumberReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
            };
            while (!hasWon) {
                this.interaction.fetchReply().then((msg) => this.message = msg);
                yield this.message.awaitReactions(filter, { max: 1 }).then((collected) => __awaiter(this, void 0, void 0, function* () {
                    const response = NumberReactions[collected.first().emoji.name];
                    yield this.removeReaction();
                    if (response == 5) {
                        yield this.aki.back();
                    }
                    else {
                        yield this.aki.step(response);
                    }
                    yield this.updateMessage();
                    if (this.aki.progress >= 75 || this.aki.currentStep >= 78) {
                        yield this.aki.win();
                        hasWon = true;
                        yield this.win();
                        return;
                    }
                }));
            }
        });
    }
    win() {
        return __awaiter(this, void 0, void 0, function* () {
            let choiceMade = false;
            yield this.message.reactions.removeAll();
            const filter = (reaction, user) => {
                return Object.keys(LetterReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
            };
            yield this.updateWinMessage('Am I right?', 0);
            for (const letter of Object.keys(LetterReactions)) {
                yield this.message.react(letter);
            }
            for (let i = 0; i < this.aki.guessCount && !choiceMade; i++) {
                yield this.updateWinMessage('Am I right?', i);
                yield this.message.awaitReactions(filter, { max: 1 }).then((collected) => __awaiter(this, void 0, void 0, function* () {
                    yield this.removeReaction();
                    if (collected.first().emoji.name == Object.keys(LetterReactions)[0]) {
                        yield this.updateWinMessage('I win again!', i);
                        yield this.message.reactions.removeAll();
                        choiceMade = true;
                    }
                }));
            }
        });
    }
    updateWinMessage(description, i) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.interaction.editReply('', new discord_js_1.MessageEmbed()
                .setTitle('Akinator:')
                .setColor('#3498db')
                .addFields({ name: 'Name:', value: this.aki.answers[i].name }, { name: 'Description:', value: this.aki.answers[i].description })
                .setImage(this.aki.answers[i].absolute_picture_path)
                .setThumbnail('https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw')
                .setDescription(description));
        });
    }
    updateMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.interaction.editReply('', new discord_js_1.MessageEmbed()
                .setTitle('Akinator:')
                .setColor('#3498db')
                .setThumbnail('https://play-lh.googleusercontent.com/rjX8LZCV-MaY3o927R59GkEwDOIRLGCXFphaOTeFFzNiYY6SQ4a-B_5t7eUPlGANrcw')
                .addFields({ name: 'Question:', value: this.aki.question }, {
                name: 'Answers:',
                value: `\n0: ${this.aki.answers[0]}\n1: ${this.aki.answers[1]}\n2: ${this.aki.answers[2]}\n3: ${this.aki.answers[3]}\n4: ${this.aki.answers[4]}\n5: Back`,
            }, { name: 'Progress:', value: this.aki.progress }));
        });
    }
    removeReaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const userReactions = this.message.reactions.cache.filter((reaction) => reaction.users.cache.has(this.interaction.user.id));
            for (const reaction of userReactions.values()) {
                yield reaction.users.remove(this.interaction.user.id);
            }
        });
    }
}
exports.Akinator = Akinator;
//# sourceMappingURL=akinator.js.map