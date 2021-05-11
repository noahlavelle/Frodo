import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';

export function joke(interaction: CommandInteraction) {
	fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
		.then((res) => res.json())
		.then(async (json) => {
			if (json.setup) {
				await interaction.reply(`${json.setup}\n${json.delivery}`);
			} else if (json.joke) {
				await interaction.reply(`${json.joke}`);
			} else if (json.additionalInfo) {
				await interaction.reply(json.additionalInfo);
			}
		})
		.catch(async (err) => {
			await interaction.reply('We could not find you an insult :confused:');
			return console.error(err);
		});
}
