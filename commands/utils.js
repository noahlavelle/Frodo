"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeReaction = void 0;
async function removeReaction(message, user) {
    const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));
    for (const reaction of userReactions.values()) {
        await reaction.users.remove(this.interaction.user.id);
    }
}
exports.removeReaction = removeReaction;
//# sourceMappingURL=utils.js.map