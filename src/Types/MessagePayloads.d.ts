import * as MessageComponents from './MessageComponents.d.ts';

export declare type MessagePayload = {
	content: string;
	embeds?: Array<MessageComponents.Embed>;
	components?: Array<MessageComponents.ActionRow>;
	hidden: boolean;
	flags?: number;
}