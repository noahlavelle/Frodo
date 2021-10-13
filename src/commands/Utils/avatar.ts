import {MessageEmbed, User} from 'discord.js';
import {EmbedColor} from '../../index';
import handleError from '../../utils';

export function avatar(interaction) {
	const user: User = interaction.options.getUser('user');
	interaction.reply({
		embeds: [
			new MessageEmbed()
				.setTitle(`${user.username}'s avatar:`)
				.setColor(EmbedColor)
				.setImage(user.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png'),
		]})
		.catch((err) => {
			handleError(err, interaction);
		});
};
