import {getMessage} from '../../utils';
import {client} from '../../index';

export async function ping(interaction) {
	const message = await getMessage(interaction);
	message.edit('`Pinging...`');
	await message.edit(`Ping: \`${message.message.createdTimestamp - interaction.createdTimestamp}\`\nDiscord API ping: \`${client.ws.ping}\``);
};
