import fetch from 'node-fetch';
import {CommandInteraction} from 'discord.js';
import {getMessage} from '../../../utils';

export async function fortune(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
	fetch('https://fortuneapi.herokuapp.com/')
		.then((res) => res.json())
		.then(async (text) => message.edit(text))
		.catch(() => {
			message.edit('We could not find you a fortune :confused:');
		});
}
