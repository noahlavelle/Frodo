"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rummy = void 0;
const discord_js_1 = require("discord.js");
const deck_1 = require("../../deck");
const utils_1 = require("./utils");
class Rummy {
    constructor(interaction) {
        this.interaction = interaction;
        if (Math.round(Math.random()) === 0) {
            this.players = [this.interaction.user, this.interaction.options.getUser('playertwo')];
        }
        else {
            this.players = [this.interaction.options.getUser('playertwo'), this.interaction.user];
        }
        ;
        this.start();
    }
    async start() {
        await this.interaction.reply(`${this.interaction.user} has challenged ${this.interaction.options.getUser('playertwo')} to a game of Rummy, Please move to DMs`);
        this.message = await utils_1.getMessage(this.interaction);
        this.deck = new deck_1.Deck();
        await this.deck.init();
        this.handMessages = [await this.players[0].send('Loading your game...'), await this.players[1].send('Loading your game...')];
        this.hands = [await this.deck.draw(10), await this.deck.draw(10)];
        await this.updateDmMessages();
    }
    async updateDmMessages() {
        for (const player of this.players) {
            const index = this.players.indexOf(player);
            const embed = new discord_js_1.MessageEmbed()
                .setTitle(`Rummy game against ${this.players[(index + 1) % 2].username}`)
                .addField('Hand:', this.hands[index].map((card) => {
                return card.code;
            }).join(', '));
            await this.handMessages[index].edit({
                content: '',
                embeds: [
                    embed,
                ],
            });
            continue;
        }
        return;
    }
}
exports.Rummy = Rummy;
//# sourceMappingURL=rummy.js.map