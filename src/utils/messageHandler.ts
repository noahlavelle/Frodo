import {Message, CommandInteraction} from 'discord.js';
import {MessageHandler} from './ErrorHandling/CommandHandler.js';
import {handleError} from './ErrorHandling/ErrorHandler.js';

export async function getMessage(interaction: CommandInteraction, onError = () => {}): Promise<MessageHandler> {
	if (!interaction.deferred || !interaction.replied) {
		await interaction.deferReply()
			.catch((err) => {
				onError();
				handleError(err, interaction);
			});
	}
	const message = await interaction.fetchReply()
		.catch((err) => {
			onError();
			handleError(err, interaction);
		});
	if (message instanceof Message) return new MessageHandler(message, interaction, onError);
}
