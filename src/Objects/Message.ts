import Client from '../Client';
import {
	APIMessage,
	APIMessageReference,
	APIMessageSnapshot,
	APIActionRow,
	APISticker,
	APIMessageStickerItems,
	APIMessageActivity,
	APIMessageInteractionMetadata,
	APIEmbed,
	APIReaction,
	APIAttachment,
	APIRoleSubscriptionData,
	APIResolvedData,
	APIPoll,
	APIMessageCall
} from '../APITypes/Objects';

import User from './User';
import Channel from './Channel';

import SnowflakeToDate from '../Utils/SnowflakeToDate';

/*
export declare type APIMessage = {
	id: string;
	channel_id: string;
	author: APIUser;
	content: string;
	timestamp: string;
	edited_timestamp?: string;
	tts: boolean;
	mention_everyone: boolean;
	mentions: Array<APIUser>;
	mention_roles: Array<string>;
	mention_channels?: Array<APIChannel>;
	attachments: Array<APIAttachment>;
	embeds: Array<APIEmbed>;
	reactions?: Array<APIReaction>;
	nonce?: string;
	pinned: boolean;
	webhook_id?: string;
	type: number;
	activity?: APIMessageActivity;
	application?: any;
	application_id?: string;
	flags?: number;
	message_reference?: APIMessageReference;
	message_snapshots?: Array<APIMessageSnapshot>;
	referenced_message?: APIMessage;
	interaction_metadata?: APIMessageInteractionMetadata;
	interaction?: APIMessageInteraction;
	thread?: APIChannel;
	components?: Array<APIActionRow>;
	sticker_items?: Array<APIMessageStickerItems>;
	stickers?: Array<APISticker>;
	position?: number;
	role_subscription_data?: APIRoleSubscriptionData;
	resolved?: APIResolvedData;
	poll?: APIPoll;
	call?: APIMessageCall;
};
*/

export default class Message {
	#client: Client;

	public readonly id: string;
	public readonly guild_id: string | null;
	public readonly channel_id: string;
	public readonly author: User;
	public readonly content: string;
	public readonly timestamp: Date;
	public readonly edited_timestamp: Date | null;
	public readonly tts: boolean;
	public readonly mention_everyone: boolean;
	public readonly mentions: User[];
	public readonly mention_roles: string[];
	public readonly mention_channels: Channel[];
	public readonly attachments: Array<APIAttachment>;
	public readonly embeds: Array<APIEmbed>;
	public readonly reactions: Array<APIReaction>;
	public readonly nonce: string | null;
	public readonly pinned: boolean;
	public readonly webhook_id: string | null;
	public readonly type: number;
	public readonly activity: APIMessageActivity | null;
	public readonly application: any;
	public readonly application_id: string | null;
	public readonly flags: number;
	public readonly message_reference: APIMessageReference | null;
	public readonly message_snapshots: Array<APIMessageSnapshot>
	public readonly referenced_message: Message | null;
	public readonly interaction_metadata: APIMessageInteractionMetadata | null;
	public readonly thread: Channel | null;
	public readonly components: Array<APIActionRow>;
	public readonly sticker_items: Array<APIMessageStickerItems>;
	public readonly sticker: APISticker | null;
	public readonly position: number;
	public readonly role_subscription_data: APIRoleSubscriptionData | null;
	public readonly resolved: APIResolvedData | null;
	public readonly poll: APIPoll | null;
	public readonly call: APIMessageCall | null;

	public readonly created_at: Date;

	constructor(client: Client, data: APIMessage) {
		this.#client = client;

		this.id = data.id;
		this.guild_id = data.guild_id ?? null;
		this.channel_id = data.channel_id;
		this.author = new User(client, data.author);
		this.content = data.content;
		this.timestamp = new Date(data.timestamp);
		this.edited_timestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		this.tts = data.tts;
		this.mention_everyone = data.mention_everyone;
		this.mentions = data.mentions.map((user) => new User(client, user));
		this.mention_roles = data.mention_roles;
		this.mention_channels = data.mention_channels ? data.mention_channels.map((channel) => new Channel(client, channel)) : [];
		this.attachments = data.attachments;
		this.embeds = data.embeds;
		this.reactions = data.reactions ?? [];
		this.nonce = data.nonce ?? null;
		this.pinned = data.pinned;
		this.webhook_id = data.webhook_id ?? null;
		this.type = data.type;
		this.activity = data.activity ?? null;
		this.application = data.application;
		this.application_id = data.application_id ?? null;
		this.flags = data.flags ?? 0;
		this.message_reference = data.message_reference ?? null;
		this.message_snapshots = data.message_snapshots ?? [];
		this.referenced_message = data.referenced_message ? new Message(client, data.referenced_message) : null;
		this.interaction_metadata = data.interaction_metadata ?? null;
		this.thread = data.thread ? new Channel(client, data.thread) : null;
		this.components = data.components ?? [];
		this.sticker_items = data.sticker_items ?? [];
		this.sticker = (data.stickers && data.stickers.length > 0) ? data.stickers[0] : null;
		this.position = data.position ?? 0;
		this.role_subscription_data = data.role_subscription_data ?? null;
		this.resolved = data.resolved ?? null;
		this.poll = data.poll ?? null;
		this.call = data.call ?? null;

		this.created_at = SnowflakeToDate(this.id);
	}

	get guild() {
		return this.#client.guilds.getSync(this.guild_id as string) ?? null;
	}

	async reply(content: any) { 
	}
}
module.exports = exports.default;