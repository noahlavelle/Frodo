import {timestamp} from '../../index';
import handleError, {getMessage} from '../../utils';

export async function uptime(interaction) {
	const message = await getMessage(interaction);
	message.edit(`Frodo started <t:${Math.round(timestamp / 1000)}:R>`);
};
