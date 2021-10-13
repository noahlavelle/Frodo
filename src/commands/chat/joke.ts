import fetch = require('node-fetch');
import {CommandInteraction} from 'discord.js';
import handleError from '../../utils';

export async function joke(interaction: CommandInteraction) {
	await interaction.deferReply()
		.catch((err) => {
			handleError(err, interaction);
		});
	fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
		.then((res) => res.json())
		.then(async (json) => {
			if (json.setup) {
				await interaction.editReply(`${json.setup}\n${json.delivery}`)
					.catch((err) => {
						handleError(err, interaction);
					});
			} else if (json.joke) {
				await interaction.editReply(`${json.joke}`)
					.catch((err) => {
						handleError(err, interaction);
					});
			} else if (json.additionalInfo) {
				await interaction.editReply(json.additionalInfo)
					.catch((err) => {
						handleError(err, interaction);
					});
			}
		})
		.catch(async (err) => {
			await interaction.editReply('We could not find you an insult :confused:')
				.catch((err) => {
					handleError(err, interaction);
				});
		});
}
