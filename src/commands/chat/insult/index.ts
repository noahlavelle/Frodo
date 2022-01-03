import fetch from 'node-fetch';
import {CommandInteraction} from 'discord.js';
import {getMessage} from '../../../utils';
import {Insult} from '../../../interfaces';

export async function insult(interaction: CommandInteraction) {
	let text = '';
	if (interaction.options.getUser('user')) text = `${interaction.options.getUser('user')} :fire: `;
	const message = await getMessage(interaction);
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then((json: Insult) => interaction.editReply(`${text}${json.insult}`))
		.catch(() => {
			message.edit('We could not find you an insult :confused:');
		});
}
