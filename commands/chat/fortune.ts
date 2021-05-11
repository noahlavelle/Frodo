import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export function fortune(interaction: CommandInteraction) {
	fetch('http://yerkee.com/api/fortune')
		.then((res) => res.json())
		.then(async (json) => interaction.reply(json.fortune))
		.catch(async (err) => {
			await interaction.reply('We could not find you a fortune :confused:');
			return console.error(err);
		});
}
