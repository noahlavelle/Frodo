"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = void 0;
const builders_1 = require("@discordjs/builders");
const connectFour_1 = require("./commands/games/connectFour");
const rps_1 = require("./commands/games/rps");
const akinator_1 = require("./commands/games/akinator");
const anagrams_1 = require("./commands/games/anagrams");
const { triviaCategories } = require('./commands/games/trivia.js');
const ttt_1 = require("./commands/games/ttt");
const othello_1 = require("./commands/games/othello");
const hangman_1 = require("./commands/games/hangman");
const werewolf_1 = require("./commands/games/werewolf");
const fact_1 = require("./commands/chat/fact");
const fortune_1 = require("./commands/chat/fortune");
const joke_1 = require("./commands/chat/joke");
const insult_1 = require("./commands/chat/insult");
const help_1 = require("./commands/Utils/help");
const uptime_1 = require("./commands/Utils/uptime");
const avatar_1 = require("./commands/Utils/avatar");
const ping_1 = require("./commands/Utils/ping");
var CommandData;
(function (CommandData) {
    CommandData.connectFourCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('connectfour')
            .setDescription('A game of connect four against another player')
            .addUserOption((option) => {
            return option
                .setName('playertwo')
                .setDescription('The user that you want to challenge')
                .setRequired(true);
        }),
        execute(interaction) {
            new connectFour_1.ConnectFour(interaction);
        },
    };
    CommandData.rpsCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('rps')
            .setDescription('A game of rock paper scissors four against another player')
            .addUserOption((option) => {
            return option
                .setName('playertwo')
                .setDescription('The user that you want to challenge')
                .setRequired(true);
        }),
        execute(interaction) {
            new rps_1.Rps(interaction);
        },
    };
    CommandData.tttCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('ttt')
            .setDescription('A game of noughts and crosses (tick tack toe)')
            .addUserOption((option) => {
            return option
                .setName('playertwo')
                .setDescription('The user that you want to challenge')
                .setRequired(true);
        }),
        execute(interaction) {
            new ttt_1.Ttt(interaction);
        },
    };
    CommandData.hangmanCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('hangman')
            .setDescription('A game of hangman')
            .addUserOption((option) => {
            return option
                .setName('playertwo')
                .setDescription('The user that you want to challenge')
                .setRequired(true);
        }),
        execute(interaction) {
            new hangman_1.Hangman(interaction);
        },
    };
    CommandData.akinatorCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('akinator')
            .setDescription('A game of akinator against the AI'),
        execute(interaction) {
            new akinator_1.Akinator(interaction);
        },
    };
    CommandData.anagramsCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('anagrams')
            .setDescription('A round of countdown as seen on the TV program'),
        execute(interaction) {
            new anagrams_1.Anagrams(interaction);
        },
    };
    CommandData.werewolfCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('werewolf')
            .setDescription('The classic party social deduction game'),
        execute(interaction) {
            new werewolf_1.Werewolf(interaction);
        },
    };
    CommandData.othelloCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('othello')
            .setDescription('A game of othello against another player')
            .addUserOption((option) => {
            return option
                .setName('playertwo')
                .setDescription('The user that you want to challenge')
                .setRequired(true);
        })
            .addBooleanOption((option) => {
            return option
                .setName('showmoves')
                .setDescription('Will show you your options that you can move to for the game')
                .setRequired(false);
        }),
        execute(interaction) {
            new othello_1.Othello(interaction);
        },
    };
    CommandData.factCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('fact')
            .setDescription('Sends a random fact'),
        execute(interaction) {
            fact_1.fact(interaction);
        },
    };
    CommandData.fortuneCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('fortune')
            .setDescription('Sends a random fortune'),
        execute(interaction) {
            fortune_1.fortune(interaction);
        },
    };
    CommandData.jokeCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('joke')
            .setDescription('Sends a random joke'),
        execute(interaction) {
            joke_1.joke(interaction);
        },
    };
    CommandData.insultCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('insult')
            .setDescription('Sends a random insult')
            .addUserOption((option) => {
            return option
                .setName('user')
                .setDescription('The user that you want to insult')
                .setRequired(false);
        }),
        execute(interaction) {
            insult_1.insult(interaction);
        },
    };
    CommandData.triviacategoriesCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('triviacategories')
            .setDescription('View all Trivia categories'),
        execute(interaction) {
            triviaCategories(interaction);
        },
    };
    CommandData.helpCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('help')
            .setDescription('Get help using Frodo'),
        execute(interaction) {
            help_1.help(interaction);
        },
    };
    CommandData.uptimeCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('uptime')
            .setDescription('View the uptime of Frodo'),
        execute(interaction) {
            uptime_1.uptime(interaction);
        },
    };
    CommandData.avatarCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('avatar')
            .setDescription('Get a user\'s avatar')
            .addUserOption((option) => {
            return option
                .setName('user')
                .setDescription('The user that you would like to get their avatar')
                .setRequired(true);
        }),
        execute(interaction) {
            avatar_1.avatar(interaction);
        },
    };
    CommandData.pingCommandData = {
        data: new builders_1.SlashCommandBuilder()
            .setName('ping')
            .setDescription('Check Frodo\'s ping'),
        execute(interaction) {
            ping_1.ping(interaction);
        },
    };
})(CommandData || (CommandData = {}));
exports.CommandData = CommandData;
//# sourceMappingURL=commandData.js.map