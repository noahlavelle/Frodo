import handleError, {getMessage} from '../../utils';
import {client} from '../../index';
import {webSocketPing, reconnecting} from '../../votes';

export async function ping(interaction) {
	const message = await getMessage(interaction);
	await message.edit('`Pinging...`')
		.catch((err) => {
			handleError(err, interaction);
		});
	await message.edit(`Ping: \`${message.message.createdTimestamp - interaction.createdTimestamp}\`\nDiscord API ping: \`${client.ws.ping}\`\nWebSocket Ping: \`${reconnecting ? 'Disconnected' : webSocketPing}\``)
		.catch((err) => {
			handleError(err, interaction);
		});
};
