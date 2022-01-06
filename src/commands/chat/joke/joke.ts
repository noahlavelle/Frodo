import {Joke} from './Joke.d';
import fetch from 'node-fetch';
import {FrodoClient, Message} from '../../../FrodoClient';

export default async function(this: FrodoClient, message: Message) {
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
