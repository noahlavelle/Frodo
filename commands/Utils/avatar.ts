import {MessageEmbed} from 'discord.js';
import {EmbedColor} from '../../index';

export function avatar(interaction) {
	const user = interaction.options.getUser('user');
	interaction.reply({
		embeds: [
			new MessageEmbed()
				.setTitle(`${user.username}'s avatar:`)
				.setColor(EmbedColor)
				.setImage(user.avatarURL()),
		]});
};
