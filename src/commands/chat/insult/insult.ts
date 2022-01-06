import {Insult} from './Insult.d';
import fetch from 'node-fetch';
import {FrodoClient, Message, Options} from '../../../FrodoClient';

export default async function(this: FrodoClient, message: Message, options: Options) {
	let text = '';
	if (options.getUser('user')) text = `${options.getUser('user')} :fire: `;
	fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
		.then((res) => res.json())
		.then((json: Insult) => message.edit(`${text}${json.insult}`))
		.catch(() => {
			message.edit('We could not find you an insult :confused:');
		});
}
