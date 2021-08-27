import {CommandData} from './commandData';

const commands = [];

Object.keys(CommandData).forEach((command) => {
	if (command === 'triviaCommandData') return;
	commands.push(CommandData[command].data.toJSON());
});

export {commands, CommandData};
