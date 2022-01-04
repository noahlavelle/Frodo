import {Insult} from './Insult.d';
import {MessageHandler} from '../../../utils/ErrorHandling/CommandHandler';
import fetch from 'node-fetch';
import {CommandInteractionOptionResolver} from 'discord.js';

export async function run(message: MessageHandler, options: CommandInteractionOptionResolver) {
	let text = '';
	if (options.getUser('user')) text = `${options.getUser('user')} :fire: `;
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then((json: Insult) => message.edit(`${text}${json.insult}`))
		.catch(() => {
			message.edit('We could not find you an insult :confused:');
		});
}
