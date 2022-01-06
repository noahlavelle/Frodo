import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'insult',
	description: 'Sends a random insult',
	options: [
		{
			name: 'user',
			description: 'The user to insult',
			type: 'USER',
			required: false,
		},
	],
	version: '1.0.0',
	main: './insult.js',
};
