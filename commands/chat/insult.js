"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insult = void 0;
const fetch = require("node-fetch");
async function insult(interaction) {
    let text = '';
    if (interaction.options.getUser('user'))
        text = `${interaction.options.getUser('user')} :fire: `;
    await interaction.deferReply();
    fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
        .then((res) => res.json())
        .then(async (json) => interaction.editReply(`${text}${json.insult}`))
        .catch(async (err) => {
        await interaction.editReply('We could not find you an insult :confused:');
        return console.error(err);
    });
}
exports.insult = insult;
//# sourceMappingURL=insult.js.map