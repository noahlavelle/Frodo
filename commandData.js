"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = exports.CommandHandlers = void 0;
const connectFour_1 = require("./commands/connectFour");
const rps_1 = require("./commands/rps");
const akinator_1 = require("./commands/akinator");
const anagrams_1 = require("./commands/anagrams");
const ttt_1 = require("./commands/ttt");
const hangman_1 = require("./commands/hangman");
const werewolf_1 = require("./commands/werewolf");
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
})(CommandData || (CommandData = {}));
exports.CommandData = CommandData;
//# sourceMappingURL=commandData.js.map