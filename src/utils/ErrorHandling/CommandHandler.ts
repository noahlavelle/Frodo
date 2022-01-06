import {
	AwaitReactionsOptions,
	CommandInteraction, EmojiIdentifierResolvable, Guild,
	Message,
	MessageEditOptions,
	MessagePayload, MessageReaction, ReactionManager, TextBasedChannels,
	User,
} from 'discord.js';

import {handleError, removeReaction} from './ErrorHandler.js';

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
