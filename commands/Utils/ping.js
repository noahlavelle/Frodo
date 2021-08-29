"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const utils_1 = require("../games/utils");
async function ping(interaction) {
    await interaction.reply(`\`Pinging...\``);
    const message = await utils_1.getMessage(interaction);
    await message.edit(`Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\``);
}
exports.ping = ping;
;
//# sourceMappingURL=ping.js.map