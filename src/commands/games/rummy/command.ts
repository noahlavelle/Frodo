import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'rummy',
	description: 'A game of rummy against another player',
	options: [
		{
			name: 'playertwo',
			description: 'The user that you want to challenge',
			required: true,
			type: 'USER',
		},
	],
	version: '1.0.0',
	main: './rummy.js',
	active: false,
};
