"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
async function ping(interaction) {
    await interaction.reply(`\`Pinging...\``);
    const message = await interaction.fetchReply();
    await message.edit(`Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\``);
}
exports.ping = ping;
;
//# sourceMappingURL=ping.js.map