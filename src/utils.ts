import {
	AwaitMessagesOptions,
	AwaitReactionsOptions,
	CommandInteraction, EmojiIdentifierResolvable, Guild, GuildManager,
	Message, MessageActionRow, MessageButton,
	MessageEditOptions,
	MessageEmbed,
	MessageInteraction,
	MessagePayload, MessageReaction, ReactionManager, TextBasedChannels,
	User,
} from 'discord.js';

export async function removeReaction(message : Message, user : User) {
	const userReactions = message.reactions.cache.filter((reaction) => reaction.users.cache.has(user.id));
	for (const reaction of userReactions.values()) {
		await reaction.users.remove(user.id);
	}
}

const erroredInteractions: string[] = [];

async function sendErrorEmbed(interaction: CommandInteraction) {
	await interaction.channel.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Something has gone wrong...  :face_with_monocle:')
				.setDescription(`${interaction.user}, something has gone wrong with your game. If you think you have found a bug, report it here: https://help.frodo.fun`)
				.setColor('#FF0134'),
		],
	}).catch(() => {});
}

export default async function handleError(error, interaction) {
	if (!erroredInteractions.includes(interaction.id)) {
		erroredInteractions.push(interaction.id);
		await sendErrorEmbed(interaction);
		if (error.code != 10008) {
			console.error(error);
		}
	}
}


export class MessageHandler {
	message: Message;
	interaction: CommandInteraction;
	onError: () => void;

	constructor(message: Message, interaction: CommandInteraction, onError: () => void) {
		this.message = message;
		this.interaction = interaction;
		this.onError = onError;
	}

	async edit(content: string | MessageEditOptions | MessagePayload): Promise<MessageHandler> {
		this.interaction.editReply(content)
			.catch((e) => {
				this.onError();
				handleError(e, this.interaction);
			});
		return this;
	}

	async react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction | void> {
		const reaction = await this.message.react(emoji)
			.catch((e) => {
				this.onError();
				handleError(e, this.interaction);
			});
		return reaction;
	}

	awaitReactions(options?: AwaitReactionsOptions) {
		return this.message.awaitReactions(options);
	}

	async removeReactions() {
		return await this.message.reactions.removeAll()
			.catch((e) => {
				this.onError();
				handleError(e, this.interaction);
			});
	}

	async removeUserReactions(user: User) {
		return await removeReaction(this.message, user)
			.catch((e) => {
				this.onError();
				handleError(e, this.interaction);
			});
	}

	get content(): string {
		return this.message.content;
	}

	get channel(): TextBasedChannels {
		return this.message.channel;
	}

	get reactions(): ReactionManager {
		return this.message.reactions;
	}

	get guild(): Guild {
		return this.message.guild;
	}

	get id(): string {
		return this.message.id;
	}
}

export class DmMessageHandler {
	message: Message;

	constructor(message: Message) {
		this.message = message;
	}

	async edit(content: string | MessageEditOptions | MessagePayload): Promise<DmMessageHandler> {
		const message = await this.message.edit(content)
			.catch((e) => {});
		return this;
	}

	async react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction | void> {
		const reaction = await this.message.react(emoji)
			.catch((e) => {});
		return reaction;
	}

	awaitReactions(options?: AwaitReactionsOptions) {
		return this.message.awaitReactions(options);
	}

	get content() {
		return this.message.content;
	}
}

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

export class button {
	label: string;
	id: string;
	style?: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
	disabled?: boolean;
}

export function createButtonRow(interaction: CommandInteraction, ...buttons: button[]): MessageActionRow {
	const buttonArray = [];
	buttons.forEach((button) => {
		buttonArray.push(
			new MessageButton()
				.setLabel(button.label)
				.setCustomId(`${interaction.id}:${button.id}`)
				.setStyle(button.style || 'PRIMARY')
				.setDisabled(button.disabled),
		);
	});
	const row = new MessageActionRow()
		.addComponents(...buttonArray);
	return row;
}
