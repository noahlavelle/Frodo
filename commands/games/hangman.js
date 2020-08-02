const utils = require('../../utils');
const { color } = require('jimp');

module.exports = {
	name: 'hangman',
    description: 'A game of hangman',
    args: true,
    usage: '<user>',
	execute(message, args, client) {
        const filter = (message => {
            return message.content == 'r' || message.content == 'p' || message.content == 's'; // The filter for await messages. It only allows the responses r, p or s
        });

        const challenged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, '')); // Getting the user who was mentioned
        if (!challenged || challenged == message.member) return message.reply('Please enter a valid user'); // If none is mentioned or you mentioned yourself return
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.'); // Checking if you are allready in a game
        if (utils.inGame.includes(challenged.id)) return message.reply('That user is allready in a game. Try again in a minute.'); // Checking if the person you challenged is in a game and if so return
        utils.inGame.push(challenged.id, message.author.id); // Push both ids to the utils.inGame array so they are registered as in a game
        class Game { // Creating a game class so there is support for multiple games at once.
            constructor() { // Defining vars and running the game logic
                this.stages = ['\_\_\_\n*      |\n*    \n*    \n*      \n*    \n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*      | \n*      \n*    \n*',
                '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      \n*    \n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    \n*',
                '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    /\n*', '\_\_\_\n*      |\n*    :dizzy_face: \n*    /|\\ \n*      |\n*    / \\\n*'];
                this.init();
                this.guesses = '';
                this.correct = 0;
                this.letters = 0;
                this.stage = 0;
            }

            async init() {
                this.msg = await message.channel.send(`${this.stages[0]}\nWaiting for <@${message.author.id}> to enter a word`);
                this.dmChannel = await message.author.send('Please enter the word to be guessed.');


                let word = await this.dmChannel.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                }).catch(() => {
                    message.author.send('This game has expired');
                })
                this.word = word.get((Array.from(word.keys())).toString()).content;
                this.displayWord = '';
                for (let i = 0; i < this.word.length; i++) this.displayWord += '-';
                this.msg.edit(`${this.stages[0]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);
                this.run();
            }

            async run() {
                let word = await message.channel.awaitMessages(m => m.author.id === challenged.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time']
                }).catch(() => {
                    this.msg.edit('This game has expired');
                })
                this.letter = word.get((Array.from(word.keys())).toString()).content;
                if (this.letter.length > 1) return this.run();
                if (this.guesses.includes(this.letter)) return this.run();
                if (this.word.toLowerCase().includes(this.letter.toLowerCase())) this.letters ++; else {
                    this.stage++;
                    this.guesses += `${this.letter.toLowerCase()} `;
                    this.msg.edit(`${this.stages[this.stage]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);

                }
                for (let i = 0; i < this.word.length; i++) {
                    if (this.word.charAt(i).toLowerCase() == this.letter.toLowerCase()) {
                        this.displayWord = this.displayWord.substr(0, i) + this.letter + this.displayWord.substr(i + 1);
                        this.msg.edit(`${this.stages[this.stage]}\n\`\`${this.displayWord}\`\`\n Wrong Guesses: ${this.guesses}`);
                         this.correct++;
                    }
                }

                if (this.correct == this.word.length) return this.msg.edit(`${this.stages[this.stage]}\nYou Won! \`\`${this.word}\`\`\n Wrong Guesses: ${this.guesses}`)

                if (this.stage == 5) {
                    return this.msg.edit(this.msg.edit(`${this.stages[this.stage]}\nYou Lost! The word was \`\`${this.word}\`\`\n Wrong Guesses: ${this.guesses}`));
                }
                this.run();
                

            }
}

    var game = new Game

	},
};