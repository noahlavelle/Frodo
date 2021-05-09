"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = exports.CommandHandlers = void 0;
const connectFour_1 = require("./commands/connectFour");
const rps_1 = require("./commands/rps");
const akinator_1 = require("./commands/akinator");
const countdown_1 = require("./commands/countdown");
const CommandHandlers = {
    'connectfour': (interaction) => {
        new connectFour_1.ConnectFour(interaction);
    },
    'rps': (interaction) => {
        new rps_1.Rps(interaction);
    },
    'akinator': (interaction) => {
        new akinator_1.Akinator(interaction);
    },
    'countdown': (interaction) => {
        new countdown_1.Countdown(interaction);
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
    CommandData.akinatorCommandData = {
        name: 'akinator',
        description: 'A game of akinator against the AI',
    };
    CommandData.countdownCommandData = {
        name: 'countdown',
        description: 'A round of countdown as seen on the TV program',
    };
})(CommandData || (CommandData = {}));
exports.CommandData = CommandData;
//# sourceMappingURL=commandData.js.map