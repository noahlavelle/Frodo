"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fact = void 0;
const fetch = require("node-fetch");
function fact(interaction) {
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
        .then((res) => res.json())
        .then(async (json) => interaction.reply(json.text))
        .catch(async (err) => {
        await interaction.reply('We could not find you a fortune :confused:');
        return console.error(err);
    });
}
exports.fact = fact;
//# sourceMappingURL=fact.js.map