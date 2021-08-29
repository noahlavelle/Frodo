import {getMessage} from '../games/utils';

export async function ping(interaction) {
	await interaction.reply(`\`Pinging...\``);
	const message = await getMessage(interaction);
	await message.edit(`Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\``);
};
