import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'leaderboard',
	description: 'View Frodo\'s current leaderboards',
	options: [
		{
			name: 'game',
			description: 'Pick a leaderboard to view',
			choices: [
				{
					name: 'Trivia',
					description: 'trivia',
				},
			],
			type: 'STRING',
		},
	],
	version: '1.0.0',
	main: './leaderboard.js',
};
