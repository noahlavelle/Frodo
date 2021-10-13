import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';
import handleError from '../../utils';

export async function fortune(interaction: CommandInteraction) {
	await interaction.deferReply()
		.catch((err) => {
			handleError(err, interaction);
		});
	fetch('https://fortuneapi.herokuapp.com/')
		.then((res) => res.json())
		.then(async (json) => interaction.editReply(json))
		.catch(async (err) => {
			await interaction.editReply('We could not find you a fortune :confused:');
		});
}
