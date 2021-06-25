export async function ping(interaction) {
	await interaction.reply(`\`Pinging...\``);
	const message = await interaction.fetchReply();
	await message.edit(`Ping: \`${message.createdTimestamp - interaction.createdTimestamp}\``);
};
