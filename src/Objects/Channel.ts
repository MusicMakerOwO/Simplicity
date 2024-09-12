import Client from '../Client';
import { APIChannel, APIMessage } from '../APITypes/Objects';
import BitField from '../DataStructures/BitField';
import ChannelFlags from '../Enums/ChannelFlags';
import ChannelTypes from '../Enums/ChannelTypes';
import LRUCache from '../DataStructures/LRUCache';

// import Endpoints from '../APITypes/Endpoints/Channels';
// import ResolveEndpoint from '../Utils/ResolveEndpoint';

export default class Channel {
	#client: Client;

	public readonly id: string;
	public readonly type: number;
	public readonly guildID: string | null;
	public readonly position: number | null;
	public readonly permissionOverwrites: Array<any> | null;
	public readonly name: string | null;
	public readonly topic: string | null;
	public readonly nsfw: boolean;
	public readonly lastMessageID: string | null;
	public readonly bitrate: number | null;
	public readonly userLimit: number | null;
	public readonly rateLimitPerUser: number | null;
	public readonly recipients: Array<any> | null;
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
	public readonly threadMetadata: any | null;
	public readonly member: any | null;
	public readonly defaultAutoArchiveDuration: number | null;
	public readonly permissions: string | null;
	public readonly flags: BitField;
	public readonly totalMessagesSent: number | null;
	public readonly availableTags: Array<any> | null;
	public readonly appliedTags: Array<string> | null;
	public readonly defaultReactionEmoji: any | null;
	public readonly defaultThreadRateLimitPerUser: number | null;
	public readonly defaultSortOrder: number | null;
	public readonly defaultForumLayout: number | null;
	public messages: LRUCache<string, APIMessage>;
	
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

		this.messages = new LRUCache<string, APIMessage>(1000);
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
}
module.exports = exports.default;