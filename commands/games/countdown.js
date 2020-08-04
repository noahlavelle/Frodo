const fetch = require('node-fetch');

class Game {
    constructor(message) {
        this.vowels = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'U'];
        this.consenants = ['B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'D', 'D', 'F', 'F', 'G', 'G', 'G', 'H', 'H', 'J', 'K', 'L', 'L', 'L', 'L', 'L', 'M', 'M', 'M', 'M', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'P', 'P', 'P', 'P', 'Q', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        this.message = message;
        this.letters = '';
        this.text = '**Countdown Anagrams:** You must choose nine letters by pressing either the vowel or constenant button. We recomend at least 3 vowels. You will then have 30 seconds to find the largest word you can.\n**Your Letters:**';
    }

    async init() {
        this.msg = await this.message.channel.send(this.text);
        await this.msg.react('🇻');
        await this.msg.react('🇨');
        this.run();
    }

    async run() {
        const filter = (reaction, user) => ['🇻', '🇨'].includes(reaction.emoji.name) && user.id === this.message.author.id;

        await this.msg.awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ['time'],
        }).then(async collected => {
            const reaction = collected.first().emoji.name;
            if (reaction === '🇻') this.letters += this.vowels[Math.round(Math.random() * this.vowels.length | 0)];
            if (reaction === '🇨') this.letters += this.consenants[Math.round(Math.random() * this.consenants.length | 0)];
            this.msg.edit(`${this.text} ${this.letters}`);
            const userReactions = this.msg.reactions.cache
                .filter(e => e.users.cache.has(this.message.author.id));
            for (const e of userReactions.values()) {
                await e.users.remove(this.message.author.id);
            }
        }).catch(() => {
            this.msg.edit('This game has timed out');
        });

        if (this.letters.length === 9) {
            this.msg.reactions.removeAll();
            this.msg.edit(`${this.text} Your 30 seconds starts now: ${this.letters}`);
            setTimeout(async () => {
                this.msg.edit(`${this.text} Please enter the longest word you came up with.`);
                let response = await this.message.channel.awaitMessages(m => m.author.id === this.message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                }).catch(() => {
                    this.msg.edit('This game has timed out.');
                });
                response = response.get(Array.from(response.keys()).toString()).content;
                await fetch(`http://www.anagramica.com/all/:${this.letters}`)
                    .then(res => res.json())
                    .then(json => { this.solved = json; })
                    .catch(err => {
                        this.message.channel.send('There was a problem while solving that anagram.');
                        console.error(err);
                    });
                if (this.solved.all.includes(response.toLowerCase())) { this.winMessage = `${response} is a valid and has ${response.letters} letters.`; } else {
                    this.winMessage = `${response} is not valid.`;
                }
                this.top = '';
                for (let i = 0; i <= 4; i++) {
                    if (i < 3) this.top += `${this.solved.all[i]}, `;
                    else if (i === 3) this.top += `${this.solved.all[i]} and`;
                    else this.top += this.solved.all[i];
                }
                this.msg.edit(`${this.text} ${this.letters}. Your choise of ${this.winMessage} The top five solutions are ${this.top}. For a full list of solutions go to https://word.tips/words-for/${this.letters}/?dictionary=wwf`);
            }, 30000);
        } else {
            this.run();
        }
    }
}

module.exports = {
    name: 'countdown',
    aliases: ['anagram', 'letters'],
    description: 'A coundown style anagram game.',
    execute(message) {
        const game = new Game(message);
        game.init();
    },
};
