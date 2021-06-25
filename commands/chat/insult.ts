import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export async function insult(interaction: CommandInteraction) {
	let text = '';
	if (interaction.options[0]?.value) text = `<@${interaction.options[0].value}> :fire: `;
	await interaction.defer();
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(`${text}${json.insult}`))
		.catch(async (err) => {
			await interaction.reply('We could not find you an insult :confused:');
			return console.error(err);
		});
}
