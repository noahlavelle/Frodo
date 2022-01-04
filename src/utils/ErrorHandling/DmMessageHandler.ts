import {Message, MessageEditOptions, MessagePayload, EmojiIdentifierResolvable, MessageReaction, AwaitReactionsOptions} from 'discord.js';

export class DmMessageHandler {
	message: Message;

	constructor(message: Message) {
		this.message = message;
	}

	async edit(content: string | MessageEditOptions | MessagePayload): Promise<DmMessageHandler> {
		await this.message.edit(content)
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
