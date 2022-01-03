import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {commands} from './resetCommands';

// @ts-ignore
import config from './config.json';

const rest = new REST({version: '9'})
	.setToken(config.token);


export async function registerCommands(command) {
	try {
		const commandsList = [...commands, ...command];
		// await rest.put(
		// 	Routes.applicationGuildCommands(clientID, guildID),
		// 	{body: commandsList},
		// );
		//
		// await rest.put(
		// 	Routes.applicationCommands(clientID),
		// 	{body: commandsList},
		// );

		console.log('Registered Commands!');
	} catch (error) {
		console.error(error);
	}
}
