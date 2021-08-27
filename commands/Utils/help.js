"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
function help(interaction) {
    const helpEmbed = new discord_js_1.MessageEmbed()
        .setColor(index_1.EmbedColor)
        .setTitle('Frodo\'s help menu')
        .setURL('https://frodo.fun/commands')
        .setDescription('All of Frodo\'s commands can be found at https://frodo.fun/commands')
        .addField('Want to add Frodo to your own server?', 'Add Frodo by going to https://invite.frodo.fun and selecting your server!')
        .addField('Get in contact with us!', 'Leave us a review at https://top.gg/bot/734746193082581084#reviews or send feedback and request features at https://frodo.fun/feedback');
    interaction.reply({ embeds: [helpEmbed] });
}
exports.help = help;
;
//# sourceMappingURL=help.js.map