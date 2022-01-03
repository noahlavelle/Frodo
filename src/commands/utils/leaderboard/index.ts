import {CommandInteraction, MessageEmbed} from 'discord.js';
import {EmbedColor} from '../../index';
import {getMessage} from '../../utils';
import {scoreboardArray} from '../../scoreboard';

export async function leaderboard(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
	if (!message) return;
	const embed = new MessageEmbed()
		.setTitle('Trivia Leaderboard')
		.setColor(EmbedColor)
		.setFooter('This feature is in Beta and may encounter some major bugs so please be patient as we work on fixing them')
		.setTimestamp();
	const description = [];
	scoreboardArray.forEach(([userId, {username, score}], index) => {
		if (index > 5) return;
		description.push(`${username}: ${score}`);
	});
	embed.setDescription(description.join('\n'));
	message.edit({
		content: 'View the scoreboard at https://frodo.fun/leaderboard',
		embeds: [embed],
	});
}
