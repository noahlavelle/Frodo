import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'avatar',
	description: 'Get a user\'s avatar',
	options: [
		{
			name: 'user',
			description: 'The user that you would like to get their avatar',
			required: true,
			type: 'USER',
		},
	],
	version: '1.0.0',
	main: './avatar.js',
};
