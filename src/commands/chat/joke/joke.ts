import {Joke} from './Joke.d';
import {MessageHandler} from '../../../utils/ErrorHandling/CommandHandler';
import fetch from 'node-fetch';

export async function run(message: MessageHandler) {
	fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
		.then((res) => res.json())
		.then((json: Joke) => {
			if (json.setup) {
				message.edit(`${json.setup}\n${json.delivery}`);
			} else if (json.joke) {
				message.edit(`${json.joke}`);
			}
		})
		.catch(() => {
			message.edit('We could not find you an insult :confused:');
		});
}
