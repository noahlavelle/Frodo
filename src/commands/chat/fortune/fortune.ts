import {MessageHandler} from '../../../utils/ErrorHandling/CommandHandler';
import fetch from 'node-fetch';

export async function run(message: MessageHandler) {
	fetch('https://fortuneapi.herokuapp.com/')
		.then((res) => res.json())
		.then(async (text) => message.edit(text))
		.catch(() => {
			message.edit('We could not find you a fortune :confused:');
		});
}
