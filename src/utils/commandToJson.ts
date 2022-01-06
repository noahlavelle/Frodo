import {SlashCommandBuilder} from '@discordjs/builders';

const TypeKeys = {
	USER: 'addUserOption',
	BOOLEAN: 'addBooleanOption',
	STRING: 'addStringOption',
};

export function commandToJson(json) {
	const command = new SlashCommandBuilder()
		.setName(json.name)
		.setDescription(json.description);

	json.options?.forEach((optionData) => {
		command[TypeKeys[optionData.type]]((option) => {
			option.setName(optionData.name);
			option.setDescription(optionData.description);
			option.setRequired(optionData.required);

			optionData.choices?.forEach((choice) => {
				option.addChoice(choice.name, choice.description);
			});

			return option;
		});
	});

	return command.toJSON();
}
