import fetch from 'node-fetch';
import {CommandInteraction} from 'discord.js';
import {getMessage} from '../../../utils';
import {Joke} from '../../../interfaces';

export async function joke(interaction: CommandInteraction) {
	const message = await getMessage(interaction);
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
