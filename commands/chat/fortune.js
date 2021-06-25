"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fortune = void 0;
const fetch = require("node-fetch");
async function fortune(interaction) {
    await interaction.defer();
    fetch('https://fortuneapi.herokuapp.com/')
        .then((res) => res.json())
        .then(async (json) => interaction.editReply(json))
        .catch(async (err) => {
        await interaction.reply('We could not find you a fortune :confused:');
    });
}
exports.fortune = fortune;
//# sourceMappingURL=fortune.js.map