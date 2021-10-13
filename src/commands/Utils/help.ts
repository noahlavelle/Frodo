import {MessageEmbed} from 'discord.js';
import {EmbedColor} from '../../index';
import handleError from '../../utils';

export function help(interaction) {
	const helpEmbed = new MessageEmbed()
		.setColor(EmbedColor)
		.setTitle('Frodo\'s help menu')
		.setURL('https://frodo.fun/commands')
		.setDescription('All of Frodo\'s commands can be found at https://frodo.fun/commands')
		.addField('Want to add Frodo to your own server?', 'Add Frodo by going to https://invite.frodo.fun and selecting your server!')
		.addField('Get in contact with us!', 'Leave us a review at https://top.gg/bot/734746193082581084#reviews or send feedback and request features at https://frodo.fun/feedback')
		.addField('Join the Support server', 'Come and join the Frodo Community at https://support.frodo.fun');
	interaction.reply({embeds: [helpEmbed]})
		.catch((err) => {
			handleError(err, interaction);
		});
};
