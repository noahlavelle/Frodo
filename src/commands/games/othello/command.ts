import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'othello',
	description: 'A game of othello against another player',
	options: [
		{
			name: 'playertwo',
			description: 'The user that you want to challenge',
			required: true,
			type: 'USER',
		},
		{
			name: 'showmoves',
			description: 'Will show you your options that you can move to for the game',
			required: false,
			type: 'BOOLEAN',
		},
	],
	version: '1.0.0',
	main: './othello.js',
};
