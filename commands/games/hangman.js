const utils = require('../../utils');

class Game { // Creating a game class so there is support for multiple games at once.
    constructor(message, challenged) { // Defining vars and running the game logic
        // eslint-disable-next-line no-useless-escape
        this.stages = ['\_\_\_\n*      |\n*    \n*    \n*      \n*    \n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*      | \n*      \n*    \n*',
            // eslint-disable-next-line no-useless-escape
            '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      \n*    \n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    \n*',
            // eslint-disable-next-line no-useless-escape
            '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    /\n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    / \\\n*'];
        this.message = message;
        this.challenged = challenged;
        this.guesses = '';
        this.typedLetters = [];
        this.correct = 0;
        this.letters = 0;
        this.stage = 0;
    }

    async init() {
        this.msg = await this.message.channel.send(`${this.stages[0]}\nWaiting for <@${this.message.author.id}> to enter a word`);
        this.dmChannel = await this.message.author.send('Please enter the word to be guessed.');


        let word = await this.dmChannel.channel.awaitMessages(m => m.author.id === this.message.author.id, {
            max: 1,
            time: 60000,
            errors: ['time'],
        }).catch(() => {
            this.end();
            this.message.author.send('This game has expired');
        });
        this.word = word.get(Array.from(word.keys()).toString()).content;
        this.displayWord = '';
        for (let i = 0; i < this.word.length; i++) this.displayWord += '-';
        this.msg.edit(`${this.stages[0]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);
        this.run();
    }

    async run() {
        let word = await this.message.channel.awaitMessages(m => m.author.id === this.challenged.id, {
            max: 1,
            time: 60000,
            errors: ['time'],
        }).catch(() => {
            this.end();
            this.msg.edit('This game has expired');
        });
        this.letter = word.get(Array.from(word.keys()).toString()).content;
        if (this.letter.length > 1) return this.run();
        if (this.guesses.includes(this.letter)) return this.run();
        if (this.word.toLowerCase().includes(this.letter.toLowerCase())) { this.letters++; } else {
            this.stage++;
            this.guesses += `${this.letter.toLowerCase()} `;
            this.msg.edit(`${this.stages[this.stage]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);
        }

        if (this.typedLetters.includes(this.letter)) {
            this.message.reply('You have allready guessed that letter');
            return this.run();
        }

        for (let i = 0; i < this.word.length; i++) {
            if (this.word.charAt(i).toLowerCase() === this.letter.toLowerCase()) {
                this.displayWord = this.displayWord.substr(0, i) + this.letter + this.displayWord.substr(i + 1);
                this.msg.edit(`${this.stages[this.stage]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);
                this.correct++;
                this.typedLetters.push(this.letter);
            }
        }

        if (this.correct === this.word.length) {
            this.end();
            return this.msg.edit(`${this.stages[this.stage]}\nYou Won! \`\`${this.word}\`\`\n Wrong Guesses: ${this.guesses}`);
        }

        if (this.stage === 5) {
            this.end();
            return this.msg.edit(this.msg.edit(`${this.stages[this.stage]}\nYou Lost! The word was \`\`${this.word}\`\`\n Wrong Guesses: ${this.guesses}`));
        }
        this.run();
    }

    end() {
        utils.inGame = utils.inGame.filter(i => i !== this.message.author.id);
        utils.inGame = utils.inGame.filter(i => i !== this.challenged.id);
        this.game = null;
    }
}

module.exports = {
    name: 'hangman',
    description: 'A game of hangman',
    args: true,
    usage: '<user>',
    execute(message, args) {
        const challenged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!challenged || challenged === message.member) return message.reply('Please enter a valid user');
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (utils.inGame.includes(challenged.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        utils.inGame.push(challenged.id, message.author.id);

        const game = new Game(message, challenged);
        game.init();
    },
};
