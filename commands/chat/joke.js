"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joke = void 0;
const fetch = require("node-fetch");
function joke(interaction) {
    fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
        .then((res) => res.json())
        .then(async (json) => {
        if (json.setup) {
            await interaction.reply(`${json.setup}\n${json.delivery}`);
        }
        else if (json.joke) {
            await interaction.reply(`${json.joke}`);
        }
        else if (json.additionalInfo) {
            await interaction.reply(json.additionalInfo);
        }
    })
        .catch(async (err) => {
        await interaction.reply('We could not find you an insult :confused:');
        return console.error(err);
    });
}
exports.joke = joke;
//# sourceMappingURL=joke.js.map