import { APIGuild, APIRole, APIEmoji, APISticker, APIWelcomeScreen, APIChannel } from "../APITypes/Objects";
import Client from "../Client";
import SnowflakeToDate from "../Utils/SnowflakeToDate";
import SlidingCache from "../DataStructures/SlidingCache";

import RoleEndpoints from "../APITypes/Endpoints/Roles";
import ChannelEndpoints from "../APITypes/Endpoints/Channels";
import EmojiEndpoints from "../APITypes/Endpoints/Emojis";
import StickerEndpoints from "../APITypes/Endpoints/Stickers";
import GuildEndpoints from "../APITypes/Endpoints/Guilds";

import Role from "./Role";
import Emoji from "./Emoji";
import Sticker from "./Sticker";
import Channel from "./Channel";

import ResolveEndpoint from "../Utils/ResolveEndpoint";

declare type ChannelCreationOptions = {
	name: string;
	type: number;
	topic?: string;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	position?: number;
	permission_overwrites?: any[];
	parent_id?: string;
	nsfw?: boolean;
	rtc_region?: string;
	video_quality_mode?: number;
	default_auto_archive_duration?: number;
	default_reaction_emoji?: any;
	available_tags?: any[];
	default_sort_order?: number;
	default_forum_layout?: number;
	default_thread_rate_limit_per_user?: number;
}

export default class Guild {
	#client: Client;

	public readonly id: string;
	public readonly name: string;
	public readonly icon: string | undefined;
	public readonly splash: string | undefined;
	public readonly discovery_splash: string | undefined;
	public readonly owner_id: string;
	public readonly permissions: string | undefined;
	public readonly region: string | undefined;
	public readonly afk_channel_id: string | undefined;
	public readonly afk_timeout: number;
	public readonly widget_enabled: boolean;
	public readonly widget_channel_id: string | undefined;
	public readonly verification_level: number;
	public readonly default_message_notifications: number;
	public readonly explicit_content_filter: number;
	public readonly features: Array<string>;
	public readonly mfa_level: number;
	public readonly application_id: string | undefined;
	public readonly system_channel_id: string | undefined;
	public readonly system_channel_flags: number;
	public readonly rules_channel_id: string | undefined;
	public readonly max_presences: number | undefined;
	public readonly max_members: number;
	public readonly vanity_url_code: string | undefined;
	public readonly description: string | undefined;
	public readonly banner: string | undefined;
	public readonly premium_tier: number;
	public readonly premium_subscription_count: number | undefined;
	public readonly preferred_locale: string;
	public readonly public_updates_channel_id: string | undefined;
	public readonly max_video_channel_users: number | undefined;
	public readonly max_stage_video_channel_users: number | undefined;
	public readonly approximate_member_count: number | undefined;
	public readonly approximate_presence_count: number | undefined;
	public readonly welcome_screen: APIWelcomeScreen | undefined;
	public readonly nsfw_level: number;
	public readonly premium_progress_bar_enabled: boolean;
	public readonly safety_alerts_channel_id: string | undefined;
	
	public readonly channels: SlidingCache<APIChannel, Channel>;
	public readonly roles: SlidingCache<APIRole, Role>;
	public readonly emojis: SlidingCache<APIEmoji, Emoji>;
	public readonly stickers: SlidingCache<APISticker, Sticker>;
	public readonly created_at: Date;
	
	constructor(client: Client, data: APIGuild) {
		this.#client = client;
		this.#client;

		this.id = data.id;
		this.name = data.name;
		this.icon = data.icon;
		this.splash = data.splash;
		this.discovery_splash = data.discovery_splash;
		this.owner_id = data.owner_id;
		this.permissions = data.permissions;
		this.region = data.region;
		this.afk_channel_id = data.afk_channel_id;
		this.afk_timeout = data.afk_timeout;
		this.widget_enabled = Boolean(data.widget_enabled);
		this.widget_channel_id = data.widget_channel_id;
		this.verification_level = data.verification_level;
		this.default_message_notifications = data.default_message_notifications;
		this.explicit_content_filter = data.explicit_content_filter;
		this.features = data.features;
		this.mfa_level = data.mfa_level;
		this.application_id = data.application_id;
		this.system_channel_id = data.system_channel_id;
		this.system_channel_flags = data.system_channel_flags;
		this.rules_channel_id = data.rules_channel_id;
		this.max_presences = data.max_presences;
		this.max_members = data.max_members;
		this.vanity_url_code = data.vanity_url_code;
		this.description = data.description;
		this.banner = data.banner;
		this.premium_tier = data.premium_tier;
		this.premium_subscription_count = data.premium_subscription_count;
		this.preferred_locale = data.preferred_locale;
		this.public_updates_channel_id = data.public_updates_channel_id;
		this.max_video_channel_users = data.max_video_channel_users;
		this.max_stage_video_channel_users = data.max_stage_video_channel_users;
		this.approximate_member_count = data.approximate_member_count;
		this.approximate_presence_count = data.approximate_presence_count;
		this.welcome_screen = data.welcome_screen;
		this.nsfw_level = data.nsfw_level;
		this.premium_progress_bar_enabled = data.premium_progress_bar_enabled;
		this.safety_alerts_channel_id = data.safety_alerts_channel_id;

		this.channels	= new SlidingCache<APIChannel,	Channel	>(client, client.channels,	this.id, ChannelEndpoints.GET_CHANNEL,	GuildEndpoints.GET_CHANNELS,	Channel,	'channel'	);
		this.roles		= new SlidingCache<APIRole,		Role	>(client, client.roles,		this.id, RoleEndpoints.GET_ROLE,		RoleEndpoints.GET_ROLES,		Role,		'role'		);
		this.emojis		= new SlidingCache<APIEmoji,	Emoji	>(client, client.emojis,	this.id, EmojiEndpoints.GET_EMOJI,		EmojiEndpoints.GET_EMOJIS,		Emoji,		'emoji'		);
		this.stickers	= new SlidingCache<APISticker,	Sticker	>(client, client.stickers,	this.id, StickerEndpoints.GET_STICKER,	StickerEndpoints.GET_STICKERS,	Sticker,	'sticker'	);

		this.created_at = SnowflakeToDate(this.id);
	}

	static equals (guild1: Object & { id: string }, guild2: Object & { id: string }) {
		return guild1.id === guild2.id;
	}

	equals (guild: Object & { id: string }) {
		return Guild.equals(this, guild);
	}

	get iconURL() {
		return this.icon ? `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.webp` : null;
	}

	get splashURL() {
		return this.splash ? `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.webp` : null;
	}

	get discoverySplashURL() {
		return this.discovery_splash ? `https://cdn.discordapp.com/discovery-splashes/${this.id}/${this.discovery_splash}.webp` : null;
	}

	get bannerURL() {
		return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.webp` : null;
	}

	get vanityURL() {
		return this.vanity_url_code ? `https://discord.gg/${this.vanity_url_code}` : null;
	}

	get systemChannel() {
		return this.system_channel_id ? this.#client.channels.getSync(this.system_channel_id) : null;
	}

	get rulesChannel() {
		return this.rules_channel_id ? this.#client.channels.getSync(this.rules_channel_id) : null;
	}

	get publicUpdatesChannel() {
		return this.public_updates_channel_id ? this.#client.channels.getSync(this.public_updates_channel_id) : null;
	}

	get safetyAlertsChannel() {
		return this.safety_alerts_channel_id ? this.#client.channels.getSync(this.safety_alerts_channel_id) : null;
	}

	async createChannel(data: ChannelCreationOptions) : Promise<Channel> {
		const endpoint = ResolveEndpoint(GuildEndpoints.CREATE_CHANNEL, { guild: this })
		const response = await this.#client.wsClient.SendRequest('POST', endpoint, { body: data }) as APIChannel;
		return new Channel(this.#client, response)
	}

	async leave() {
		const endpoint = ResolveEndpoint(GuildEndpoints.LEAVE_GUILD, { guild: this })
		await this.#client.wsClient.SendRequest('DELETE', endpoint)
	}
}
module.exports = exports.default;