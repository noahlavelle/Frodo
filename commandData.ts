import {ConnectFour} from './commands/connectFour';
import {Rps} from './commands/rps';
import {Akinator} from './commands/akinator';
import {Anagrams} from './commands/anagrams';
import {Oxo} from './commands/oxo';

const CommandHandlers = {
	'connectfour': (interaction) => {
		new ConnectFour(interaction);
	},
	'rps': (interaction) => {
		new Rps(interaction);
	},
	'oxo': (interaction) => {
		new Oxo(interaction);
	},
	'akinator': (interaction) => {
		new Akinator(interaction);
	},
	'anagrams': (interaction) => {
		new Anagrams(interaction);
	},
};

namespace CommandData {
    export const connectFourCommandData = {
    	name: 'connectfour',
    	description: 'A game of connect four against another player',
    	options: [
    		{
    			name: 'playertwo',
    			type: 'USER',
    			description: 'The user that you want to challenge',
    			required: true,
    		},
    	],
    };

	export const rpsCommandData = {
		name: 'rps',
		description: 'A game of rock paper scissors four against another player',
		options: [
			{
				name: 'playertwo',
				type: 'USER',
				description: 'The user that you want to challenge',
				required: true,
			},
		],
	};

	export const oxoCommandData = {
		name: 'oxo',
		description: 'A game of noughts and crosses (tick tack toe)',
		options: [
			{
				name: 'playertwo',
				type: 'USER',
				description: 'The user that you want to challenge',
				required: true,
			},
		],
	};

	export const akinatorCommandData = {
		name: 'akinator',
		description: 'A game of akinator against the AI',
	};

	export const anagramsCommandData = {
		name: 'anagrams',
		description: 'A round of countdown as seen on the TV program',
	};
}

export {CommandHandlers, CommandData};
