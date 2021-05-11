import {ConnectFour} from './commands/games/connectFour';
import {Rps} from './commands/games/rps';
import {Akinator} from './commands/games/akinator';
import {Anagrams} from './commands/games/anagrams';
import {Ttt} from './commands/games/ttt';
import {Hangman} from './commands/games/hangman';
import {Werewolf} from './commands/games/werewolf';
import {fact} from './commands/chat/fact';
import {fortune} from './commands/chat/fortune';
import {joke} from './commands/chat/joke';
import {insult} from './commands/chat/insult';

const CommandHandlers = {
	'connectfour': (interaction) => {
		new ConnectFour(interaction);
	},
	'rps': (interaction) => {
		new Rps(interaction);
	},
	'ttt': (interaction) => {
		new Ttt(interaction);
	},
	'hangman': (interaction) => {
		new Hangman(interaction);
	},
	'akinator': (interaction) => {
		new Akinator(interaction);
	},
	'anagrams': (interaction) => {
		new Anagrams(interaction);
	},
	'werewolf': (interaction) => {
		new Werewolf(interaction);
	},

	'fact': (interaction) => {
		fact(interaction);
	},
	'fortune': (interaction) => {
		fortune(interaction);
	},
	'joke': (interaction) => {
		joke(interaction);
	},
	'insult': (interaction) => {
		insult(interaction);
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

	export const tttCommandData = {
		name: 'ttt',
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

	export const hangmanCommandData = {
		name: 'hangman',
		description: 'A game of hangman',
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

	export const werewolfCommandData = {
		name: 'werewolf',
		description: 'The classic party social deduction game',
	};

	export const factCommandData = {
		name: 'fact',
		description: 'Sends a random fact',
	};
	export const fortuneCommandData = {
		name: 'fortune',
		description: 'Sends a random fortune',
	};
	export const jokeCommandData = {
		name: 'joke',
		description: 'Sends a random joke',
	};
	export const insultCommandData = {
		name: 'insult',
		description: 'Sends a random insult',
	};
}

export {CommandHandlers, CommandData};
