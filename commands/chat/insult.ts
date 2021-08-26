import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export async function insult(interaction: CommandInteraction) {
	let text = '';
	if (interaction.options.getUser('user')) text = `${interaction.options.getUser('user')} :fire: `;
	await interaction.deferReply();
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(`${text}${json.insult}`))
		.catch(async (err) => {
			await interaction.editReply('We could not find you an insult :confused:');
			return console.error(err);
		});
}
