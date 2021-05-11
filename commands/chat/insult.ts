import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export function insult(interaction: CommandInteraction) {
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then(async (json) => interaction.reply(json.insult))
		.catch(async (err) => {
			await interaction.reply('We could not find you an insult :confused:');
			return console.error(err);
		});
}
