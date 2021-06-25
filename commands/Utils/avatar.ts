import {MessageEmbed} from 'discord.js';
import {client, EmbedColor} from '../../index';

export function avatar(interaction) {
	const user = client.users.cache.get(interaction.options[0].value);
	interaction.reply(
		new MessageEmbed()
			.setTitle(`${user.username}'s avatar:`)
			.setColor(EmbedColor)
			.setImage(user.avatarURL()),
	);
};
