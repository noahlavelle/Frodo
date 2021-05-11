import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export function fact(interaction: CommandInteraction) {
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json) => interaction.reply(json.text))
		.catch(async (err) => {
		 await interaction.reply('We could not find you a fortune :confused:');
			return console.error(err);
		});
}
