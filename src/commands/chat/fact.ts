import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';
import {getMessage} from '../../utils';

export async function fact(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json) => message.edit(json.text))
		.catch(async (err) => {
		 	await message.edit('We could not find you a fact :confused:');
		});
}
