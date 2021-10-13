import {timestamp} from '../../index';
import handleError from '../../utils';

export function uptime(interaction) {
	interaction.reply(`Frodo started <t:${Math.round(timestamp / 1000)}:R>`)
		.catch((err) => {
			handleError(err, interaction);
		});
};
