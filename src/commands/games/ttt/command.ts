import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'ttt',
	description: 'A game of tic tac toe against another player',
	options: [
		{
			name: 'playertwo',
			description: 'The user that you want to challenge',
			required: true,
			type: 'USER',
		},
	],
	version: '1.0.0',
	main: './ttt.js',
};
