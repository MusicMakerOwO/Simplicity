import Client from '../Client';
import { APIChannel, APIDefaultReaction, APIForumTag, APIMessage, APIPermissionOverwrite, APIThreadMember, APIThreadMetadata, APIUser } from '../APITypes/Objects';
import Message from './Message';
import BitField from '../DataStructures/BitField';
import ChannelFlags from '../Enums/ChannelFlags';
import ChannelTypes from '../Enums/ChannelTypes';
import SnowflakeToDate from '../Utils/SnowflakeToDate';
import SlidingCache from '../DataStructures/SlidingCache';

import ResolveEndpoint from '../Utils/ResolveEndpoint';
// import ChannelEndpoints from '../APITypes/Endpoints/Channels';
import MessageEndpoints from '../APITypes/Endpoints/Messages';
import ConvertMessagePayload from '../Utils/ConvertMessagePayload';

export default class Channel {
	#client: Client;

	public readonly id: string;
	public readonly type: number;
	public readonly guildID: string | null;
	public readonly position: number | null;
	public readonly permissionOverwrites: Array<APIPermissionOverwrite> | null;
	public readonly name: string | null;
	public readonly topic: string | null;
	public readonly nsfw: boolean;
	public readonly lastMessageID: string | null;
	public readonly bitrate: number | null;
	public readonly userLimit: number | null;
	public readonly rateLimitPerUser: number | null;
	public readonly recipients: Array<APIUser> | null;
	public readonly icon: string | null;
	public readonly ownerID: string | null;
	public readonly applicationID: string | null;
	public readonly managed: boolean;
	public readonly parentID: string | null;
	public readonly lastPinTimestamp: string | null;
	public readonly rtcRegion: string | null;
	public readonly videoQualityMode: number | null;
	public readonly messageCount: number | null;
	public readonly memberCount: number | null;
	public readonly threadMetadata: APIThreadMetadata | null;
	public readonly member: APIThreadMember | null;
	public readonly defaultAutoArchiveDuration: number | null;
	public readonly permissions: string | null;
	public readonly flags: BitField;
	public readonly totalMessagesSent: number | null;
	public readonly availableTags: Array<APIForumTag> | null;
	public readonly appliedTags: Array<string> | null;
	public readonly defaultReactionEmoji: APIDefaultReaction | null;
	public readonly defaultThreadRateLimitPerUser: number | null;
	public readonly defaultSortOrder: number | null;
	public readonly defaultForumLayout: number | null;

	public readonly messages: SlidingCache<APIMessage, Message>;
	public readonly created_at: Date;
	
	constructor(client: Client, data: APIChannel) {
		this.#client = client;
		this.#client;

		this.id = data.id;
		this.type = data.type;
		this.guildID = data.guild_id ?? null;
		this.position = data.position ?? null;
		this.permissionOverwrites = data.permission_overwrites ?? null;
		this.name = data.name ?? null;
		this.topic = data.topic ?? null;
		this.nsfw = Boolean(data.nsfw);
		this.lastMessageID = data.last_message_id ?? null;
		this.bitrate = data.bitrate ?? null;
		this.userLimit = data.user_limit ?? null;
		this.rateLimitPerUser = data.rate_limit_per_user ?? null;
		this.recipients = data.recipients ?? null;
		this.icon = data.icon ?? null;
		this.ownerID = data.owner_id ?? null;
		this.applicationID = data.application_id ?? null;
		this.managed = Boolean(data.managed);
		this.parentID = data.parent_id ?? null;
		this.lastPinTimestamp = data.last_pin_timestamp ?? null;
		this.rtcRegion = data.rtc_region ?? null;
		this.videoQualityMode = data.video_quality_mode ?? null;
		this.messageCount = data.message_count ?? null;
		this.memberCount = data.member_count ?? null;
		this.threadMetadata = data.thread_metadata ?? null;
		this.member = data.member ?? null;
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration ?? null;
		this.permissions = data.permissions ?? null;
		this.flags = new BitField(data.flags ?? 0, ChannelFlags);
		this.totalMessagesSent = data.total_message_sent ?? null;
		this.availableTags = data.available_tags ?? null;
		this.appliedTags = data.applied_tags ?? null;
		this.defaultReactionEmoji = data.default_reaction_emoji ?? null;
		this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user ?? null;
		this.defaultSortOrder = data.default_sort_order ?? null;
		this.defaultForumLayout = data.default_forum_layout ?? null;

		console.log(data);

		this.messages = new SlidingCache<APIMessage, Message>(client, 'messages', this.guildID as string, '', '', Message, ''); 
		this.created_at = SnowflakeToDate(this.id);
	}

	static TEXT_CHANNEL_TYPES = [
		ChannelTypes.GUILD_TEXT,
		ChannelTypes.GUILD_ANNOUNCEMENT,
		ChannelTypes.ANNOUNCEMENT_THREAD,
		ChannelTypes.PUBLIC_THREAD,
		ChannelTypes.PRIVATE_THREAD,
		ChannelTypes.GUILD_FORUM
	];
	static VOICE_CHANNEL_TYPES = [
		ChannelTypes.GUILD_VOICE,
		ChannelTypes.GUILD_STAGE_VOICE
	];
	static THREAD_CHANNEL_TYPES = [
		ChannelTypes.ANNOUNCEMENT_THREAD,
		ChannelTypes.PUBLIC_THREAD,
		ChannelTypes.PRIVATE_THREAD
	];
	static STORE_CHANNEL_TYPES = [
		ChannelTypes.GUILD_DIRECTORY,
		ChannelTypes.GUILD_FORUM,
		ChannelTypes.GUILD_MEDIA
	];
	static DM_CHANNEL_TYPES = [
		ChannelTypes.DM,
		ChannelTypes.GROUP_DM
	];

	isTextBased(): boolean {
		return Channel.TEXT_CHANNEL_TYPES.includes(this.type);
	}

	isVoiceBased(): boolean {
		return Channel.VOICE_CHANNEL_TYPES.includes(this.type);
	}

	isThreadBased(): boolean {
		return Channel.THREAD_CHANNEL_TYPES.includes(this.type);
	}

	isStoreBased(): boolean {
		return Channel.STORE_CHANNEL_TYPES.includes(this.type);
	}

	isDMBased(): boolean {
		return Channel.DM_CHANNEL_TYPES.includes(this.type);
	}

	async send(content: any) : Promise<Message | null> {
		const payload = ConvertMessagePayload(content);
		const endpoint = ResolveEndpoint(MessageEndpoints.SEND_MESSAGE, { 'channel': this });
		const data = await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload }) as APIMessage;
		if (!data) return null;
		console.log(data);
		return new Message(this.#client, data);
	}

	toString() {
		return `<#${this.id}>`;
	}
}
module.exports = exports.default;