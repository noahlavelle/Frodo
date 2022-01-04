import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'hangman',
	description: 'A game of hangman',
	options: [
		{
			name: 'playertwo',
			description: 'The user that you want to challenge',
			required: true,
			type: 'USER',
		},
	],
	version: '1.0.0',
	main: './hangman.js',
};
