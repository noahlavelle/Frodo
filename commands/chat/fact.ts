import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export async function fact(interaction: CommandInteraction) {
	await interaction.deferReply();
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(json.text))
		.catch(async (err) => {
		 	await interaction.editReply('We could not find you a fortune :confused:');
		});
}
