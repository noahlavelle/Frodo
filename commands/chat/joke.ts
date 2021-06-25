import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export async function joke(interaction: CommandInteraction) {
	await interaction.defer();
	fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
		.then((res) => res.json())
		.then(async (json) => {
			if (json.setup) {
				await interaction.editReply(`${json.setup}\n${json.delivery}`);
			} else if (json.joke) {
				await interaction.editReply(`${json.joke}`);
			} else if (json.additionalInfo) {
				await interaction.editReply(json.additionalInfo);
			}
		})
		.catch(async (err) => {
			await interaction.editReply('We could not find you an insult :confused:');
		});
}
