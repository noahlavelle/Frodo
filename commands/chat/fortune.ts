import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export async function fortune(interaction: CommandInteraction) {
	await interaction.defer();
	fetch('https://fortuneapi.herokuapp.com/')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(json))
		.catch(async (err) => {
			await interaction.reply('We could not find you a fortune :confused:');
		});
}
