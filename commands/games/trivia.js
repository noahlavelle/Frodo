"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triviaCategories = exports.Trivia = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const fetch = require("node-fetch");
const atob = require("atob");
const builders_1 = require("@discordjs/builders");
const refreshCommands_1 = require("../../refreshCommands");
const utils_1 = require("./utils");
const characters = ['🇦', '🇧', '🇨', '🇩'];
const letterMap = ['A', 'B', 'C', 'D'];
let games = [];
let gamesEmbed;
let error = false;
const errorEmbed = new discord_js_1.MessageEmbed()
    .setColor('#ff0000')
    .setTitle('Error')
    .setDescription('Hm, looks like there was an error when trying to get your question.');
(async () => {
    let json;
    try {
        json = await (await fetch('https://opentdb.com/api_category.php')).json();
    }
    catch (err) {
        console.log(err);
        error = true;
    }
    if (error)
        return;
    games = json.trivia_categories;
    let cats = '';
    games.forEach((cat) => cats += cat.name + '\n');
    gamesEmbed = new discord_js_1.MessageEmbed()
        .setColor(index_1.EmbedColor)
        .setTitle('Question Categories')
        .setDescription(cats)
        .addField('Difficulties', 'Easy\nMedium\nHard\nAny')
        .setFooter('Type /trivia <difficulty> <category> and make sure to not use any spaces in the category');
    // eslint-disable-next-line prefer-const
    let commandArray = [];
    games.forEach((cat) => commandArray.push([
        cat.name,
        cat.name,
    ]));
    const command = new builders_1.SlashCommandBuilder()
        .setName('trivia')
        .setDescription('A game of Trivia')
        .addStringOption((option) => {
        option
            .setName('difficulty')
            .setDescription('Select the difficulty of the question')
            .addChoices([
            [
                'Easy',
                'easy',
            ],
            [
                'Medium',
                'medium',
            ],
            [
                'Hard',
                'hard',
            ],
            [
                'Any',
                'any',
            ],
        ]);
        return option;
    })
        .addStringOption((option) => {
        option
            .setName('category')
            .setDescription('Select the category of the question')
            .addChoices(commandArray);
        return option;
    });
    refreshCommands_1.registerCommands([command.toJSON()]);
})();
class Trivia {
    constructor(interaction) {
        if (error)
            return interaction.reply(errorEmbed);
        this.interaction = interaction;
        this.init();
    }
    async init() {
        const difficulty = this.interaction.options.getString('difficulty');
        const category = this.interaction.options.getString('category');
        await this.interaction.deferReply();
        let url = 'https://opentdb.com/api.php?amount=1&encode=base64';
        if (difficulty && difficulty != 'any')
            url += `&difficulty=${difficulty}`;
        if (category) {
            let id;
            games.forEach((cate) => {
                if (cate.name == category)
                    id = id = cate.id;
            });
            url += `&category=${id}`;
        }
        let json;
        try {
            json = await (await fetch(url)).json();
        }
        catch (err) {
            return this.interaction.editReply({ embeds: [errorEmbed] });
        }
        if (json.response_code != 0)
            return this.interaction.editReply({ embeds: [errorEmbed] });
        let options = [];
        let optionsTimeOut = [];
        let optionsAnswerCorrect = [];
        let optionsAnswerIncorrect = [];
        let answer;
        if (atob(json.results[0].type) === 'boolean') {
            options = [
                `${letterMap[0]} - True`,
                `${letterMap[1]} - False`,
            ];
            optionsTimeOut = [
                `${letterMap[0]} - ${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}True${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}`,
                `${letterMap[1]} - ${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}False${atob(json.results[0].correct_answer) === 'True' ? '**' : ''}`,
            ];
            optionsAnswerCorrect = [
                `${letterMap[0]} - True${atob(json.results[0].correct_answer) === 'True' ? ' :white_check_mark:' : ''}`,
                `${letterMap[1]} - False${atob(json.results[0].correct_answer) === 'False' ? ' :white_check_mark:' : ''}`,
            ];
            optionsAnswerIncorrect = [
                `${letterMap[0]} - True`,
                `${letterMap[1]} - False`,
            ];
            answer = atob(json.results[0].correct_answer) === 'True' ? 0 : 1;
        }
        else {
            const ranQ = Math.round(Math.random() * 3);
            answer = ranQ;
            let currentAnswer = 0;
            options[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}`;
            optionsTimeOut[ranQ] = `**${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}**`;
            optionsAnswerCorrect[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)} :white_check_mark:`;
            optionsAnswerIncorrect[ranQ] = `${letterMap[ranQ]} - ${atob(json.results[0].correct_answer)}`;
            if (!options[0]) {
                options[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsTimeOut[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerCorrect[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerIncorrect[0] = `${letterMap[0]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                currentAnswer++;
            }
            if (!options[1]) {
                options[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsTimeOut[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerCorrect[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerIncorrect[1] = `${letterMap[1]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                currentAnswer++;
            }
            if (!options[2]) {
                options[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsTimeOut[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerCorrect[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerIncorrect[2] = `${letterMap[2]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                currentAnswer++;
            }
            if (!options[3]) {
                options[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsTimeOut[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerCorrect[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                optionsAnswerIncorrect[3] = `${letterMap[3]} - ${atob(json.results[0].incorrect_answers[currentAnswer])}`;
                currentAnswer++;
            }
        }
        await this.interaction.editReply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setTitle(atob(json.results[0].question))
                    .setDescription(options.join('\n'))
                    .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
            ]
        });
        this.message = await utils_1.getMessage(this.interaction);
        options.forEach((a, index) => this.message.react(characters[index]));
        const filter = (r, user) => user.id == this.interaction.user.id && characters.includes(r.emoji.name);
        this.message.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] }).then((col) => {
            this.message.reactions.removeAll();
            if (characters.indexOf(col.first().emoji.name) == answer) {
                this.interaction.editReply({
                    content: `Correct :smile:`,
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setColor(index_1.EmbedColor)
                            .setTitle(atob(json.results[0].question))
                            .setDescription(optionsAnswerCorrect.join('\n'))
                            .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
                    ]
                });
            }
            else {
                optionsAnswerIncorrect[characters.indexOf(col.first().emoji.name)] += ' :x:';
                this.interaction.editReply({
                    content: `You got it wrong :cry:, The answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`,
                    embeds: [
                        new discord_js_1.MessageEmbed()
                            .setColor(index_1.EmbedColor)
                            .setTitle(atob(json.results[0].question))
                            .setDescription(optionsAnswerIncorrect.join('\n'))
                            .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
                    ]
                });
            }
        }).catch(() => {
            this.message.reactions.removeAll();
            this.interaction.editReply({
                content: `The game timed out! The correct answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`,
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor(index_1.EmbedColor)
                        .setTitle(atob(json.results[0].question))
                        .setDescription(optionsTimeOut.join('\n'))
                        .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`),
                ]
            });
        });
    }
    ;
}
exports.Trivia = Trivia;
function triviaCategories(interaction) {
    if (error)
        return interaction.reply({ embeds: [errorEmbed] });
    interaction.reply({ embeds: [gamesEmbed] });
}
exports.triviaCategories = triviaCategories;
//# sourceMappingURL=trivia.js.map