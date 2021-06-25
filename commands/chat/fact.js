"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fact = void 0;
const fetch = require("node-fetch");
async function fact(interaction) {
    await interaction.defer();
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then((res) => res.json())
        .then(async (json) => interaction.editReply(json.text))
        .catch(async (err) => {
        await interaction.reply('We could not find you a fortune :confused:');
    });
}
exports.fact = fact;
//# sourceMappingURL=fact.js.map