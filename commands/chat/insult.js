"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insult = void 0;
const fetch = require("node-fetch");
function insult(interaction) {
    fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
        .then((res) => res.json())
        .then(async (json) => interaction.reply(json.insult))
        .catch(async (err) => {
        await interaction.reply('We could not find you an insult :confused:');
        return console.error(err);
    });
}
exports.insult = insult;
//# sourceMappingURL=insult.js.map