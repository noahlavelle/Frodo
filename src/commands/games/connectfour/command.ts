import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'connectfour',
	description: 'A game of connect four against another player',
	options: [
	    {
	        name: 'playertwo',
	        description: 'The user that you want to challenge',
	        required: true,
	        type: 'USER',
	    },
	],
	main: './connectfour.js',
	version: '1.0.0',
};
