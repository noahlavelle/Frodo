import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';
import handleError from '../../utils';

export async function insult(interaction: CommandInteraction) {
	let text = '';
	if (interaction.options.getUser('user')) text = `${interaction.options.getUser('user')} :fire: `;
	await interaction.deferReply()
		.catch((err) => {
			handleError(err, interaction);
		});
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(`${text}${json.insult}`))
		.catch(async (err) => {
			await interaction.editReply('We could not find you an insult :confused:')
				.catch((err) => {
					handleError(err, interaction);
				});
			return console.error(err);
		});
}
