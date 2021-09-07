import {timestamp} from '../../index';

export function uptime(interaction) {
	interaction.reply(`Frodo started <t:${Math.round(timestamp / 1000)}:R>`);
};
