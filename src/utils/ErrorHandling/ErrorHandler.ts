import {ButtonInteraction, CommandInteraction, Message, MessageEmbed, User} from 'discord.js';

export async function removeReaction(message : Message, user : User) {
	const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));
	for (const reaction of userReactions.values()) {
		await reaction.users.remove(user.id)
			.catch((err) => {});
	}
}

const erroredInteractions: string[] = [];

async function sendErrorEmbed(interaction: CommandInteraction) {
	await interaction.channel.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Something has gone wrong...  :face_with_monocle:')
				.setDescription(`${interaction.user}, something has gone wrong with your game. If you think you have found a bug, report it here: https://help.frodo.fun`)
				.setColor('#FF0134'),
		],
	}).catch(() => {});
}

export async function handleError(error, interaction) {
	if (interaction instanceof ButtonInteraction) return;
	if (!erroredInteractions.includes(interaction.id)) {
		erroredInteractions.push(interaction.id);
		await sendErrorEmbed(interaction);
		if (error.code != 10008) {
			console.error(error);
		}
	}
}
