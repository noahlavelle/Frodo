import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';
import handleError from '../../utils';

export async function fact(interaction: CommandInteraction) {
	await interaction.deferReply()
		.catch((err) => {
			handleError(err, interaction);
		});
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(json.text))
		.catch(async (err) => {
		 	await interaction.editReply('We could not find you a fortune :confused:');
		});
}
