/* eslint-disable max-statements-per-line */
const utils = require('../../utils');

class Game { // Creating a game class so there is support for multiple games at once.
    constructor(message, challenged, args) { // Defining vars and running the game logic
        this.message = message;
        this.challenged = challenged;
        this.args = args;
    }

    async run() {
        const filter = m => /^[rps]$/i.test(m.content);
        this.message.channel.send(`You have challenged ${this.args[0]} to a game of RPS. Please move into DMs.`);
        const p1Message = await this.message.author.send('You have created a game of rps. Please enter r, p, s');
        const p2Message = await this.challenged.send('You have been challenged a game of rps. Please enter r, p, s'); // Sending both messages and storing the dm channel
        // Awaiting a response from p1 and timing out if none is given
        const p1Response = p1Message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
        }).catch(() => {
            this.message.author.send('This game has expired');
            this.endGame();
        });
        // Awaiting a response from p2 and timing out if none is given
        const p2Response = p2Message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
        }).catch(() => {
            this.challenged.send('This game has expired');
            this.endGame();
        });

        // Waiting until both awaitMessages has been fufilled and running the win calculations
        Promise.all([p1Response, p2Response]).then(values => {
            if (typeof values[0] !== 'undefined' || typeof values[0] !== 'undefined') {
                this.winChecks(values);
            }
        });
    }

    winChecks(values) {
        const p1Choise = values[0].get(Array.from(values[0].keys()).toString()).content;
        const p2Choise = values[1].get(Array.from(values[1].keys()).toString()).content;

        // Win checks. I don't like this code and may change it later
        if (p1Choise === 'r' && p2Choise === 's') return this.win('p1'); else if (p2Choise === 'r' && p1Choise === 's') return this.win('p2'); else if (p2Choise === 'r' && p1Choise === 'r') return this.win('draw'); // Rock checks
        if (p1Choise === 'p' && p2Choise === 'r') return this.win('p1'); else if (p2Choise === 'p' && p1Choise === 'r') return this.win('p2'); else if (p2Choise === 'p' && p1Choise === 'p') return this.win('draw'); // Paper checks
        if (p1Choise === 's' && p2Choise === 'p') return this.win('p1'); else if (p2Choise === 's' && p1Choise === 'p') return this.win('p2'); else if (p2Choise === 's' && p1Choise === 's') return this.win('draw'); // Scissors checks
    }

    win(type) {
        switch (type) { // Sending win messages based on the outcome of the win calculations
            case 'p1':
                this.message.author.send(`You Won!`);
                this.challenged.send('You lost :(');
                break;
            case 'p2':
                this.challenged.send('You Won!');
                this.message.author.send('You lost :(');
                break;
            case 'draw':
                this.message.author.send('It was a draw.');
                this.challenged.send('It was a draw.');
                break;
        }
        this.endGame();
    }

    endGame() {
        // Filtering the people in the game out of the utils.inGame array
        utils.inGame = utils.inGame.filter(i => i !== this.message.author.id);
        utils.inGame = utils.inGame.filter(i => i !== this.challenged.id);
    }
}

module.exports = {
    name: 'rps',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user name>',
    guildOnly: true,
    execute(message, args) {
        const challenged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!challenged || challenged === message.member) return message.reply('Please enter a valid user');
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (utils.inGame.includes(challenged.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        utils.inGame.push(challenged.id, message.author.id);

        const game = new Game(message, challenged, args); // Creating a new instance of the game
        game.run();
    },
};
