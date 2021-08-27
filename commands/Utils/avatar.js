"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avatar = void 0;
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
function avatar(interaction) {
    const user = interaction.options.getUser('user');
    interaction.reply({
        embeds: [
            new discord_js_1.MessageEmbed()
                .setTitle(`${user.username}'s avatar:`)
                .setColor(index_1.EmbedColor)
                .setImage(user.avatarURL()),
        ]
    });
}
exports.avatar = avatar;
;
//# sourceMappingURL=avatar.js.map