"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triviaCategories = exports.Trivia = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const fetch = require("node-fetch");
const atob = require("atob");
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
        error = true;
    }
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
    games.forEach((cat) => commandArray.push({
        name: cat.name,
        value: cat.name,
    }));
    index_1.client.once('ready', async () => {
        const command = {
            name: 'trivia',
            description: 'A game of Trivia',
            options: [
                {
                    name: 'difficulty',
                    type: 3,
                    description: 'Select the difficulty of the question',
                    choices: [
                        {
                            name: 'Easy',
                            value: 'easy',
                        },
                        {
                            name: 'Medium',
                            value: 'medium',
                        },
                        {
                            name: 'Hard',
                            value: 'hard',
                        },
                        {
                            name: 'Any',
                            value: 'any',
                        },
                    ],
                },
                {
                    name: 'category',
                    type: 3,
                    description: 'Select the category of the question',
                    // @ts-ignore
                    choices: commandArray,
                },
            ],
        };
        await index_1.client.guilds.cache.get('839919274395303946')?.commands.create(command);
        await index_1.client.guilds.cache.get('853033979803729920')?.commands.create(command);
    });
})();
class Trivia {
    constructor(interaction) {
        if (error)
            return interaction.reply(errorEmbed);
        this.interaction = interaction;
        this.init();
    }
    async init() {
        let value;
        const difficulty = this.interaction.options[0]?.value;
        const category = this.interaction.options[1]?.value;
        if (!difficulty || difficulty == 'any' && !category)
            value = `Generating a trivia question!`;
        else if (difficulty && !category)
            value = `Generating a ${difficulty} trivia question!`;
        else if (category) {
            if (difficulty == 'any')
                value = `Generating a trivia question from the ${category} category!`;
            else
                value = `Generating a ${difficulty} trivia question from the ${category} category!`;
        }
        await this.interaction.reply(new discord_js_1.MessageEmbed()
            .setColor(index_1.EmbedColor)
            .setDescription(value));
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
            return this.interaction.editReply(errorEmbed);
        }
        if (json.response_code != 0)
            return this.interaction.editReply(errorEmbed);
        let options = [];
        const optionsTimeOut = [];
        const optionsAnswerCorrect = [];
        const optionsAnswerIncorrect = [];
        let answer;
        if (atob(json.results[0].type) == 'boolean') {
            options = [
                `${letterMap[0]} - True`,
                `${letterMap[1]} - False`,
            ];
            answer = atob(json.results[0].correct_answer) == 'True' ? 0 : 1;
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
        await this.interaction.editReply(new discord_js_1.MessageEmbed()
            .setColor(index_1.EmbedColor)
            .setTitle(atob(json.results[0].question))
            .setDescription(options.join('\n'))
            .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`));
        this.message = await this.interaction.fetchReply();
        options.forEach((a, index) => this.message.react(characters[index]));
        this.message.awaitReactions((r, user) => user.id == this.interaction.user.id && characters.includes(r.emoji.name), { max: 1, time: 30000, errors: ['time'] }).then((col) => {
            this.message.reactions.removeAll();
            if (characters.indexOf(col.first().emoji.name) == answer) {
                this.interaction.editReply(`Correct :smile:`, new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setTitle(atob(json.results[0].question))
                    .setDescription(optionsAnswerCorrect.join('\n'))
                    .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`));
            }
            else {
                optionsAnswerIncorrect[characters.indexOf(col.first().emoji.name)] += ' :x:';
                this.interaction.editReply(`You got it wrong :cry:, The answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`, new discord_js_1.MessageEmbed()
                    .setColor(index_1.EmbedColor)
                    .setTitle(atob(json.results[0].question))
                    .setDescription(optionsAnswerIncorrect.join('\n'))
                    .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`));
            }
        }).catch(() => {
            this.message.reactions.removeAll();
            this.interaction.editReply(`The game timed out! The correct answer was :regional_indicator_${letterMap[answer].toLocaleLowerCase()}:`, new discord_js_1.MessageEmbed()
                .setColor(index_1.EmbedColor)
                .setTitle(atob(json.results[0].question))
                .setDescription(optionsTimeOut.join('\n'))
                .setFooter(`Category - ${atob(json.results[0].category)}, Difficulty - ${atob(json.results[0].difficulty)}`));
        });
    }
    ;
}
exports.Trivia = Trivia;
function triviaCategories(interaction) {
    if (error)
        return interaction.reply(errorEmbed);
    interaction.reply(gamesEmbed);
}
exports.triviaCategories = triviaCategories;
//# sourceMappingURL=trivia.js.map