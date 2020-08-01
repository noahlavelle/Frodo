const utils = require('../../utils');
const fetch = require('node-fetch');
const { compareHashes } = require('jimp');

module.exports = {
	name: 'anagram',
    description: 'Play a countdown style anagram game.',
    aliases: ['countdown'],
    execute(message, args, client) { // Getting the user who was mentioned
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.'); // Checking if you are allready in a game
        utils.inGame.push(message.author.id); // Push both ids to the utils.inGame array so they are registered as in a game
        class Game { // Creating a game class so there is support for multiple games at once.
            constructor(message, challenged) { // Defining vars and running the game logic
                this.vowels = ['A','A','A','A','A','A','A','A','A','A','A','A','A','A','A','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','E','I','I','I','I','I','I','I','I','I','I','I','I','I','O','O','O','O','O','O','O','O','O','O','O','O','U','U','U','U','U']
                this.constenants = ['B','B','C','C','C','D','D','D','D','D','D','F','F','G','G','G','H','H','J','K','L','L','L','L','L','M','M','M','M','N','N','N','N','N','N','N','N','P','P','P','P','Q','R','R','R','R','R','R','R','R','R','S','S','S','S','S','S','S','S','S','T','T','T','T','T','T','T','T','T','V','W','X','Y','Z']
                this.message = message;
                this.letters = '';
                this.text = '**Countdown Anagrams:** You must choose nine letters by pressing either the vowel or constenant button. We recogmend at least 3 vowels. You will then have 30 seconds to find the largest word you can.\n**Your Letters:**'
                this.init();
            }

            async init() {
                this.msg = await message.channel.send(this.text);
                await this.msg.react('🇻')
                await this.msg.react('🇨')
                this.run();
            }

            async run() {
                const filter = (reaction, user) => {
                    return ['🇻', '🇨'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
    
                await this.msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first().emoji.name;
                        if (reaction === '🇻') this.letters += this.vowels[Math.random() * this.vowels.length | 0]
                        if (reaction === '🇨') this.letters += this.constenants[Math.random() * this.constenants.length | 0]
                        this.msg.edit(`${this.text} ${this.letters}`)
                        const userReactions = this.msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                        for (const reaction of userReactions.values()) {
                            await reaction.users.remove(message.author.id);
                        }
                    }).catch(() => {
                        this.msg.edit('This game has timed out.');
                        game = null;
                        this.msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    })

                    if (this.letters.length == 9) {
                        this.msg.reactions.removeAll();
                        this.msg.edit(`${this.text} Your 30 seconds starts now: ${this.letters}`);
                        setTimeout(async () => {
                            this.msg.edit(`${this.text} Please type the longest word you got.`);
                            let response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { // Awaiting a response from p1 and timing out if none is given
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            })
                            response = (response.get((Array.from(response.keys())).toString()).content);
                            await fetch(`http://www.anagramica.com/all/:${this.letters}`)
                                .then(res => res.json())
                                .then(json => this.solved = json)
                                .catch(err => {
                                    message.channel.send('There was a problem while solving that anagram');
                                    return console.error(err);
                                });
                            if (this.solved.all.includes(response.toLowerCase())) this.win = `${response} is valid and has ${response.length} letters`; else this.win = `${response} is not valid`
                            this.top = '';
                            for (let i = 0; i <= 4; i++) {
                                if (i < 3) this.top += `${this.solved.all[i]}, `; else if (i == 3) this.top += `${this.solved.all[i]} and `; else this.top += this.solved.all[i]
                            }
                            this.msg.edit(`${this.text} ${this.letters}. Your choise of ${this.win}. The top five solutions are ${this.top}. For a full list of solutions go to https://word.tips/words-for/${this.letters}/?dictionary=wwf`)
                        }, 30000);
            }
            if (this.letters.length < 9) this.run();
        }

}

    var game = new Game

	},
};