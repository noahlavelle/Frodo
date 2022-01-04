import {MessageHandler} from '../../../utils/ErrorHandling/CommandHandler';
import fetch from 'node-fetch';
import {Fact} from './Fact.d';

export async function run(message: MessageHandler) {
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json: Fact) => message.edit(json.text))
		.catch(() => {
		 	message.edit('We could not find you a fact :confused:');
		});
}
