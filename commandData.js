"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = exports.CommandHandlers = void 0;
const connectFour_1 = require("./commands/connectFour");
const rps_1 = require("./commands/rps");
const akinator_1 = require("./commands/akinator");
const anagrams_1 = require("./commands/anagrams");
const oxo_1 = require("./commands/oxo");
const CommandHandlers = {
    'connectfour': (interaction) => {
        new connectFour_1.ConnectFour(interaction);
    },
    'rps': (interaction) => {
        new rps_1.Rps(interaction);
    },
    'oxo': (interaction) => {
        new oxo_1.Oxo(interaction);
    },
    'akinator': (interaction) => {
        new akinator_1.Akinator(interaction);
    },
    'anagrams': (interaction) => {
        new anagrams_1.Anagrams(interaction);
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
    CommandData.oxoCommandData = {
        name: 'oxo',
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
    CommandData.akinatorCommandData = {
        name: 'akinator',
        description: 'A game of akinator against the AI',
    };
    CommandData.anagramsCommandData = {
        name: 'anagrams',
        description: 'A round of countdown as seen on the TV program',
    };
})(CommandData || (CommandData = {}));
exports.CommandData = CommandData;
//# sourceMappingURL=commandData.js.map