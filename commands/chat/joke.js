"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joke = void 0;
const fetch = require("node-fetch");
async function joke(interaction) {
    await interaction.defer();
    fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
        .then((res) => res.json())
        .then(async (json) => {
        if (json.setup) {
            await interaction.editReply(`${json.setup}\n${json.delivery}`);
        }
        else if (json.joke) {
            await interaction.editReply(`${json.joke}`);
        }
        else if (json.additionalInfo) {
            await interaction.editReply(json.additionalInfo);
        }
    })
        .catch(async (err) => {
        await interaction.editReply('We could not find you an insult :confused:');
    });
}
exports.joke = joke;
//# sourceMappingURL=joke.js.map