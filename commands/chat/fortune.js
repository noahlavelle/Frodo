"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fortune = void 0;
const fetch = require("node-fetch");
function fortune(interaction) {
    fetch('http://yerkee.com/api/fortune')
        .then((res) => res.json())
        .then(async (json) => interaction.reply(json.fortune))
        .catch(async (err) => {
        await interaction.reply('We could not find you a fortune :confused:');
        return console.error(err);
    });
}
exports.fortune = fortune;
//# sourceMappingURL=fortune.js.map