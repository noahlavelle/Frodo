import {CommandInteraction, MessageEmbed} from 'discord.js';

const erroredInteractions: string[] = [];

async function sendErrorEmbed(interaction: CommandInteraction) {
	await interaction.channel.send( {
		embeds: [
			new MessageEmbed()
				.setTitle('Something has gone wrong :confused:')
				.setDescription(`${interaction.user}, something has gone wrong with your game. If you think you have found a bug, report it here: https://frodo.fun/feedback`)
				.setColor('#B00020.'),
		],
	});
}

export default async function handleError(error, interaction) {
	if (!erroredInteractions.includes(interaction.id)) {
		erroredInteractions.push(interaction.id);
		await sendErrorEmbed(interaction);
		if (error.code != 10008) {
			console.error(error);
		}
	}
}
