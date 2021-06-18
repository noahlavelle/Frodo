"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = exports.CommandHandlers = void 0;
const connectFour_1 = require("./commands/games/connectFour");
const rps_1 = require("./commands/games/rps");
const akinator_1 = require("./commands/games/akinator");
const anagrams_1 = require("./commands/games/anagrams");
const { Trivia, triviaCategories } = require('./commands/games/trivia.js');
const ttt_1 = require("./commands/games/ttt");
const othello_1 = require("./commands/games/othello");
const hangman_1 = require("./commands/games/hangman");
const werewolf_1 = require("./commands/games/werewolf");
const fact_1 = require("./commands/chat/fact");
const fortune_1 = require("./commands/chat/fortune");
const joke_1 = require("./commands/chat/joke");
const insult_1 = require("./commands/chat/insult");
const CommandHandlers = {
    'connectfour': (interaction) => {
        new connectFour_1.ConnectFour(interaction);
    },
    'rps': (interaction) => {
        new rps_1.Rps(interaction);
    },
    'ttt': (interaction) => {
        new ttt_1.Ttt(interaction);
    },
    'hangman': (interaction) => {
        new hangman_1.Hangman(interaction);
    },
    'akinator': (interaction) => {
        new akinator_1.Akinator(interaction);
    },
    'anagrams': (interaction) => {
        new anagrams_1.Anagrams(interaction);
    },
    'werewolf': (interaction) => {
        new werewolf_1.Werewolf(interaction);
    },
    'trivia-categories': (interaction) => {
        triviaCategories(interaction);
    },
    'trivia': (interaction) => {
        new Trivia(interaction);
    },
    'othello': (interaction) => {
        new othello_1.Othello(interaction);
    },
    'fact': (interaction) => {
        fact_1.fact(interaction);
    },
    'fortune': (interaction) => {
        fortune_1.fortune(interaction);
    },
    'joke': (interaction) => {
        joke_1.joke(interaction);
    },
    'insult': (interaction) => {
        insult_1.insult(interaction);
    },
};
exports.CommandHandlers = CommandHandlers;
var CommandData;
(function (CommandData) {
    CommandData.connectFourCommandData = {
        name: 'connectfour',
        description: 'A game of connect four against another player',
        options: [
            {
                name: 'playertwo',
                type: 'USER',
                description: 'The user that you want to challenge',
                required: true,
            },
        ],
    };
    CommandData.rpsCommandData = {
        name: 'rps',
        description: 'A game of rock paper scissors four against another player',
        options: [
            {
                name: 'playertwo',
                type: 'USER',
                description: 'The user that you want to challenge',
                required: true,
            },
        ],
    };
    CommandData.tttCommandData = {
        name: 'ttt',
        description: 'A game of noughts and crosses (tick tack toe)',
        options: [
            {
                name: 'playertwo',
                type: 'USER',
                description: 'The user that you want to challenge',
                required: true,
            },
        ],
    };
    CommandData.hangmanCommandData = {
        name: 'hangman',
        description: 'A game of hangman',
        options: [
            {
                name: 'playertwo',
                type: 'USER',
                description: 'The user that you want to challenge',
                required: true,
            },
        ],
    };
    CommandData.akinatorCommandData = {
        name: 'akinator',
        description: 'A game of akinator against the AI',
    };
    CommandData.anagramsCommandData = {
        name: 'anagrams',
        description: 'A round of countdown as seen on the TV program',
    };
    CommandData.werewolfCommandData = {
        name: 'werewolf',
        description: 'The classic party social deduction game',
    };
    CommandData.othello = {
        name: 'othello',
        description: 'A game of othello against another player',
        options: [
            {
                name: 'playertwo',
                type: 'USER',
                description: 'The user that you want to challenge',
                required: true,
            },
        ],
    };
    CommandData.factCommandData = {
        name: 'fact',
        description: 'Sends a random fact',
    };
    CommandData.fortuneCommandData = {
        name: 'fortune',
        description: 'Sends a random fortune',
    };
    CommandData.jokeCommandData = {
        name: 'joke',
        description: 'Sends a random joke',
    };
    CommandData.insultCommandData = {
        name: 'insult',
        description: 'Sends a random insult',
    };
    CommandData.triviaCategoriesCommandData = {
        name: 'trivia-categories',
        description: 'View all Trivia categories',
    };
})(CommandData || (CommandData = {}));
exports.CommandData = CommandData;
//# sourceMappingURL=commandData.js.map