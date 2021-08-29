import {SlashCommandBuilder} from '@discordjs/builders';

import {ConnectFour} from './commands/games/connectFour';
import {Rps} from './commands/games/rps';
import {Akinator} from './commands/games/akinator';
import {Anagrams} from './commands/games/anagrams';
const {triviaCategories} = require('./commands/games/trivia.js');
import {Ttt} from './commands/games/ttt';
import {Othello} from './commands/games/othello';
import {Hangman} from './commands/games/hangman';
// import {Werewolf} from './commands/games/werewolf';
import {fact} from './commands/chat/fact';
import {fortune} from './commands/chat/fortune';
import {joke} from './commands/chat/joke';
import {insult} from './commands/chat/insult';
import {help} from './commands/Utils/help';
import {uptime} from './commands/Utils/uptime';
import {avatar} from './commands/Utils/avatar';
import {ping} from './commands/Utils/ping';
import {Trivia} from './commands/games/trivia';
import {Rummy} from './commands/games/rummy';

namespace CommandData {
	export const connectfourCommandData = {
		data: new SlashCommandBuilder()
			.setName('connectfour')
			.setDescription('A game of connect four against another player')
			.addUserOption((option) => {
				return option
					.setName('playertwo')
					.setDescription('The user that you want to challenge')
					.setRequired(true);
			}),
		execute(interaction) {
			new ConnectFour(interaction);
		},
	};

	export const rpsCommandData = {
		data: new SlashCommandBuilder()
			.setName('rps')
			.setDescription('A game of rock paper scissors four against another player')
			.addUserOption((option) => {
				return option
					.setName('playertwo')
					.setDescription('The user that you want to challenge')
					.setRequired(true);
			}),
		execute(interaction) {
			new Rps(interaction);
		},
	};

	// export const rummyCommandData = {
	// 	data: new SlashCommandBuilder()
	// 		.setName('rummy')
	// 		.setDescription('A game of rummy against another player')
	// 		.addUserOption((option) => {
	// 			return option
	// 				.setName('playertwo')
	// 				.setDescription('The user that you want to challenge')
	// 				.setRequired(true);
	// 		}),
	// 	execute(interaction) {
	// 		new Rummy(interaction);
	// 	},
	// };

	export const tttCommandData = {
		data: new SlashCommandBuilder()
			.setName('ttt')
			.setDescription('A game of noughts and crosses (tick tack toe)')
			.addUserOption((option) => {
				return option
					.setName('playertwo')
					.setDescription('The user that you want to challenge')
					.setRequired(true);
			}),
		execute(interaction) {
			new Ttt(interaction);
		},
	};

	export const hangmanCommandData = {
		data: new SlashCommandBuilder()
			.setName('hangman')
			.setDescription('A game of hangman')
			.addUserOption((option) => {
				return option
					.setName('playertwo')
					.setDescription('The user that you want to challenge')
					.setRequired(true);
			}),
		execute(interaction) {
			new Hangman(interaction);
		},
	};

	export const akinatorCommandData = {
		data: new SlashCommandBuilder()
			.setName('akinator')
			.setDescription('A game of akinator against the AI'),
		execute(interaction) {
			new Akinator(interaction);
		},
	};

	export const anagramsCommandData = {
		data: new SlashCommandBuilder()
			.setName('anagrams')
			.setDescription('A round of countdown as seen on the TV program'),
		execute(interaction) {
			new Anagrams(interaction);
		},
	};

	// export const werewolfCommandData = {
	// 	data: new SlashCommandBuilder()
	// 		.setName('werewolf')
	// 		.setDescription('The classic party social deduction game'),
	// 	execute(interaction) {
	// 		new Werewolf(interaction);
	// 	},
	// };

	export const othelloCommandData = {
		data: new SlashCommandBuilder()
			.setName('othello')
			.setDescription('A game of othello against another player')
			.addUserOption((option) => {
				return option
					.setName('playertwo')
					.setDescription('The user that you want to challenge')
					.setRequired(true);
			})
			.addBooleanOption((option) => {
				return option
					.setName('showmoves')
					.setDescription('Will show you your options that you can move to for the game')
					.setRequired(false);
			}),
		execute(interaction) {
			new Othello(interaction);
		},
	};

	export const factCommandData = {
		data: new SlashCommandBuilder()
			.setName('fact')
			.setDescription('Sends a random fact'),
		execute(interaction) {
			fact(interaction);
		},
	};

	export const fortuneCommandData = {
		data: new SlashCommandBuilder()
			.setName('fortune')
			.setDescription('Sends a random fortune'),
		execute(interaction) {
			fortune(interaction);
		},
	};

	export const jokeCommandData = {
		data: new SlashCommandBuilder()
			.setName('joke')
			.setDescription('Sends a random joke'),
		execute(interaction) {
			joke(interaction);
		},
	};

	export const insultCommandData = {
		data: new SlashCommandBuilder()
			.setName('insult')
			.setDescription('Sends a random insult')
			.addUserOption((option) => {
				return option
					.setName('user')
					.setDescription('The user that you want to insult')
					.setRequired(false);
			}),
		execute(interaction) {
			insult(interaction);
		},
	};

	export const triviacategoriesCommandData = {
		data: new SlashCommandBuilder()
			.setName('triviacategories')
			.setDescription('View all Trivia categories'),
		execute(interaction) {
			triviaCategories(interaction);
		},
	};

	export const triviaCommandData = {
		data: undefined,
		execute(interaction) {
			new Trivia(interaction);
		},
	};

	export const helpCommandData = {
		data: new SlashCommandBuilder()
			.setName('help')
			.setDescription('Get help using Frodo'),
		execute(interaction) {
			help(interaction);
		},
	};

	export const uptimeCommandData = {
		data: new SlashCommandBuilder()
			.setName('uptime')
			.setDescription('View the uptime of Frodo'),
		execute(interaction) {
			uptime(interaction);
		},
	};

	export const avatarCommandData = {
		data: new SlashCommandBuilder()
			.setName('avatar')
			.setDescription('Get a user\'s avatar')
			.addUserOption((option) => {
				return option
					.setName('user')
					.setDescription('The user that you would like to get their avatar')
					.setRequired(true);
			}),
		execute(interaction) {
			avatar(interaction);
		},
	};

	export const pingCommandData = {
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Check Frodo\'s ping'),
		execute(interaction) {
			ping(interaction);
		},
	};
}

export {CommandData};
