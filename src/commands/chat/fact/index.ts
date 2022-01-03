import fetch from 'node-fetch';
import {CommandInteraction} from 'discord.js';
import {getMessage} from '../../../utils.js';
import {Fact} from '../../../interfaces.js';

export async function fact(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json: Fact) => message.edit(json.text))
		.catch(() => {
		 	message.edit('We could not find you a fact :confused:');
		});
}
