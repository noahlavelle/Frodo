import {Message, User} from 'discord.js';

export async function removeReaction(message : Message, user : User) {
	const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));
	for (const reaction of userReactions.values()) {
		await reaction.users.remove(user.id);
	}
}
