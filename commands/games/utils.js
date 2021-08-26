"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.removeReaction = void 0;
const discord_js_1 = require("discord.js");
async function removeReaction(message, user) {
    const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));
    for (const reaction of userReactions.values()) {
        await reaction.users.remove(user.id);
    }
}
exports.removeReaction = removeReaction;
async function getMessage(interaction) {
    const message = await interaction.fetchReply();
    if (message instanceof discord_js_1.Message)
        return message;
}
exports.getMessage = getMessage;
//# sourceMappingURL=utils.js.map