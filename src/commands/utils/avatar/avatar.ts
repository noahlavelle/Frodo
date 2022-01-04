import {MessageEmbed, User} from 'discord.js';
import {EmbedColor} from '../../index';
import {getMessage} from '../../utils';

export async function avatar(interaction) {
	const user: User = interaction.options.getUser('user');
	const message = await getMessage(interaction);
	message.edit({
		embeds: [
			new MessageEmbed()
				.setTitle(`${user.username}'s avatar:`)
				.setColor(EmbedColor)
				.setImage(user.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png'),
		]});
};
