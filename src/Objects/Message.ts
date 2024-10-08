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
import Emoji from './Emoji';

import SnowflakeToDate from '../Utils/SnowflakeToDate';

import MessageEndpoints from '../APITypes/Endpoints/Messages';
import ResolveEndpoint from '../Utils/ResolveEndpoint';
import ConvertMessagePayload from '../Utils/ConvertMessagePayload';
import Collector from './Collector';

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
	public readonly user: User;
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

	public readonly emojis: Array<{ id: string, name: string, animated: boolean }>;
	public readonly created_at: Date;

	constructor(client: Client, data: APIMessage) {
		this.#client = client;

		this.id = data.id;
		this.guild_id = data.guild_id ?? null;
		this.channel_id = data.channel_id;
		this.user = new User(client, data.author);
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

		this.emojis = [];

		const foundEmojis = this.content.match(/<a?:\w+:\d+>/g) ?? [];
		for (const emoji of foundEmojis) {
			const match = emoji.match(/<(a)?:(\w+):(\d+)>/) as RegExpMatchArray;
			this.emojis.push({
				id: match.shift() as string,
				name: match.shift() as string,
				animated: match.shift() === 'a'
			});
		}

		this.created_at = SnowflakeToDate(this.id);
	}

	static equals (message1: Object & { id: string }, message2: Object & { id: string }) {
		return message1.id === message2.id;
	}

	equals (message: Object & { id: string }) {
		return Message.equals(this, message);
	}

	get guild() {
		return this.#client.guilds.getSync(this.guild_id as string) ?? null;
	}

	get channel() {
		return this.#client.channels.getSync(this.channel_id) ?? null;
	}

	toString() {
		return `https://discord.com/channels/${this.guild_id ?? '@me'}/${this.channel_id}/${this.id}`;
	}

	async reply(content: any) : Promise<Message> {
		const payload = ConvertMessagePayload(content);
		const endpoint = ResolveEndpoint(MessageEndpoints.CREATE_MESSAGE, { channel: { id: this.channel_id } });
		const response = await this.#client.wsClient.SendRequest(endpoint, 'POST', { body: payload }) as APIMessage;
		return new Message(this.#client, response);
	}

	async delete() {
		const endpoint = ResolveEndpoint(MessageEndpoints.DELETE_MESSAGE, { channel: { id: this.channel_id }, message: this });
		await this.#client.wsClient.SendRequest(endpoint, 'DELETE');
	}
	
	async edit(content: any) {
		const payload = ConvertMessagePayload(content);
		const endpoint = ResolveEndpoint(MessageEndpoints.EDIT_MESSAGE, { channel: { id: this.channel_id }, message: this });
		const response = await this.#client.wsClient.SendRequest('PATCH', endpoint, { body: payload }) as APIMessage;
		return new Message(this.#client, response);
	}

	async react(emoji: string | Emoji) {
		const emojiString = String(emoji);
		if (emojiString === '[object Object]') throw new Error('Invalid emoji provided - Enter a string (preferred) <:emoji:ID> or <a:emoji:ID> or use the Emoji object');

		const [_, emojiName, emojiID ] = emojiString.match(/(\w+):(\d+)/) ?? []
		if (!emojiID || !emojiName) throw new Error('Invalid emoji provided - Enter a string (preferred) <:emoji:ID> or <a:emoji:ID> or use the Emoji object');

		const endpoint = ResolveEndpoint(MessageEndpoints.CREATE_REACTION, { channel: { id: this.channel_id }, message: this, emoji: `${emojiName}%3A${emojiID}` });
		await this.#client.wsClient.SendRequest('PUT', endpoint);
	}

	simplify() {
		return {
			guildID: this.guild_id,
			channelID: this.channel_id,
			userID: this.user.id,
			content: this.content,
			timestamp: this.timestamp.toISOString(),
			embeds: this.embeds,
			files: this.attachments,
			emojis: this.emojis,
			sticker: this.sticker
		}
	}
	
	createCollector() {
		return new Collector(this.#client, this.channel_id, this.id);
	}
}
module.exports = exports.default;