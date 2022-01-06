import {MessageActionRow, MessageButton} from 'discord.js';
import {FrodoClient, Message} from '../../../FrodoClient';

export default function(this: FrodoClient, message: Message) {
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
			new MessageButton()
				.setLabel('Join the support server')
				.setURL('https://support.frodo.fun')
				.setStyle('LINK'),
		);

	message.edit({
		content: 'If you enjoy Frodo, please leave a review below!',
		components: [row],
	});
}
