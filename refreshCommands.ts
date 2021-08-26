import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {CommandData} from './commandData';

const commands = [];

for (const command of Object.keys(CommandData)) {
	commands.push(CommandData[command].data.toJSON());
};

const rest = new REST({version: '9'})
	.setToken(process.env.TOKEN);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands('737286732512493580', '839919274395303946'),
			{body: []},
		);

		await rest.put(
			Routes.applicationGuildCommands('737286732512493580', '839919274395303946'),
			{body: commands},
		);

		await rest.put(
			Routes.applicationCommands('737286732512493580'),
			{body: []},
		);

		console.log('Registered Commands!');
	} catch (error) {
		console.error(error);
	}
})();
