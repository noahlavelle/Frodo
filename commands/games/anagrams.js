"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Anagrams = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("./utils");
const fetch = require('node-fetch');
const LetterReactions = {
    '🇻': 0,
    '🇨': 1,
};
class Anagrams {
    constructor(interaction) {
        // eslint-disable-next-line max-len
        this.vowels = [
            'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'E', 'E',
            'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'I', 'I',
            'I', 'I', 'I', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U',
            'U', 'U', 'U',
        ];
        this.consonants = [
            'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'F', 'G', 'G', 'G', 'H', 'H', 'J', 'K', 'L',
            'L', 'L', 'L', 'L', 'M', 'M', 'M', 'M', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'P', 'P', 'P', 'P', 'Q',
            'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T',
            'T', 'T', 'T', 'T', 'T', 'T', 'V', 'W', 'X', 'Y', 'Z',
        ];
        this.interaction = interaction;
        this.runGame();
    }
    async runGame() {
        await this.interaction.deferReply();
        this.message = await utils_1.getMessage(this.interaction);
        let letters = '';
        await this.updateMessage(letters, '');
        for (const letter of Object.keys(LetterReactions)) {
            await this.message.react(letter);
        }
        const filter = (reaction, user) => {
            return Object.keys(LetterReactions).includes(reaction.emoji.name) && user.id == this.interaction.user.id;
        };
        while (letters.length < 9) {
            try {
                await this.message.awaitReactions({
                    filter,
                    max: 1,
                    time: 300000,
                    errors: ['time'],
                }).then(async (collected) => {
                    const reactionNumber = LetterReactions[collected.first().emoji.name];
                    await utils_1.removeReaction(this.message, this.interaction.user);
                    letters += reactionNumber == 0 ? this.vowels[Math.floor(Math.random() * this.vowels.length)] : this.consonants[Math.floor(Math.random() * this.consonants.length)];
                    await this.updateMessage(letters, '');
                });
            }
            catch (err) {
                this.message.reactions.removeAll();
                return this.interaction.editReply('The game has timed out!');
            }
            ;
        }
        await this.message.reactions.removeAll();
        await this.updateMessage(letters, '\nYour 30 seconds starts now!');
        setTimeout(async () => {
            await this.updateMessage(letters, '\nNow type the longest word you got.');
            const filter = (m) => {
                return m.author.id == this.interaction.user.id;
            };
            const channel = await this.interaction.channel;
            channel.awaitMessages({ filter, max: 1 }).then(async (collected) => {
                const word = collected.first().content;
                await collected.first().delete();
                let solved;
                await fetch(`http://www.anagramica.com/all/:${letters}`)
                    .then((res) => res.json())
                    .then((json) => solved = json);
                await this.updateMessage(letters, `\nYour choice of ${word} was ${solved.all.includes(word.toLowerCase()) ? 'an' : 'not an'} option. To see a full list of words click [here](https://word.tips/unscramble/${letters})`);
            });
        }, 30000);
    }
    async updateMessage(letters, playAttachment) {
        await this.interaction.editReply({ embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle('Countdown')
                    .setColor('#3498db')
                    .addFields({
                    name: 'How to Play:',
                    value: 'You must choose nine letters by pressing either the vowel or Consonant button. You will then have 30 seconds to find the largest word you can.',
                }, { name: 'Play:', value: (letters == '' ? '...' : letters) + playAttachment }),
            ] });
    }
}
exports.Anagrams = Anagrams;
//# sourceMappingURL=anagrams.js.map