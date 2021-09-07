import {CommandInteraction, MessageActionRow, MessageButton} from 'discord.js';

export function invite(interaction: CommandInteraction) {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setLabel('Invite Me!')
				.setURL('https://invite.frodo.fun')
				.setStyle('LINK'),
			new MessageButton()
				.setLabel('Send some feedback')
				.setURL('https://frodo.fun/feedback')
				.setStyle('LINK'),
			new MessageButton()
				.setLabel('Leave a review')
				.setURL('https://top.gg/bot/734746193082581084#reviews')
				.setStyle('LINK'),
		);
	interaction.reply({
		content: 'If you enjoy Frodo, please leave a review below!',
		components: [row],
	});
}
