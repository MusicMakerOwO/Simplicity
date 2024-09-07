export declare type APIAvatarDecoration = {
	asset: string;
	sku_id: string;
};

export declare type APIMember = {
	user: APIUser;
	nick?: string;
	avatar?: string;
	roles: string[];
	joined_at: string;
	premium_since?: string;
	deaf: boolean;
	mute: boolean;
	flags: number;
	pending?: boolean;
	permissions?: string;
	communication_disabled_until?: string;
	avatar_decoration_data?: APIAvatarDecoration;
};

export declare type APIUser = {
	id: string;
	username: string;
	discriminator: string;
	global_name?: string;
	avatar?: string;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	banner?: string;
	accent_color?: number;
	locale?: string;
	verified?: boolean;
	email?: string;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
	avatar_decoration_data?: APIAvatarDecoration;
};

export declare type APIRole = {
	id: string;
	name: string;
	color: number;
	hoist: boolean;
	icon?: string;
	unicode_emoji?: string;
	position: number;
	permissions: string;
	managed: boolean;
	mentionable: boolean;
	tags?: APIRoleTags;
	flags: number;
};

export declare type APIRoleTags = {
	bot_id?: string;
	integration_id?: string;
	premium_subscriber?: null;
	subscription_listing_id?: string;
	available_for_purchase?: null;
	guild_connections?: null;
};

export declare type APIEmoji = {
	id: string;
	name: string;
	roles?: string[];
	user?: APIUser;
	require_colons?: boolean;
	managed?: boolean;
	animated?: boolean;
	available?: boolean;
};

export enum APIStickerTypes {
	Standard = 1,
	Guild = 2
}

export enum APIStickerFormat {
	PNG = 1,
	APNG = 2,
	Lottie = 3,
	GIF = 4
}

export declare type APISticker = {
	id: string;
	pack_id?: string;
	name: string;
	description: string;
	tags: string;
	type: APIStickerTypes;
	format_type: APIStickerFormat;
	available?: boolean;
	guild_id?: string;
	user?: APIUser;
	sort_value?: number;
};

export declare type APIGuildFeatures =
	| 'ANIMATED_BANNER'
	| 'ANIMATED_ICON'
	| 'APPLICATION_COMMAND_PERMISSIONS_V2'
	| 'AUTO_MODERATION'
	| 'BANNER'
	| 'COMMUNITY'
	| 'CREATOR_MONETIZABLE_PROVISIONAL'
	| 'CREATOR_STORE_PAGE'
	| 'DEVELOPER_SUPPORT_SERVER'
	| 'DISCOVERABLE'
	| 'FEATURABLE'
	| 'INVITES_DISABLED'
	| 'INVITE_SPLASH'
	| 'MEMBER_VERIFICATION_GATE_ENABLED'
	| 'MORE_STICKERS'
	| 'NEWS'
	| 'PARTNERED'
	| 'PREVIEW_ENABLED'
	| 'RAID_ALERTS_DISABLED'
	| 'ROLE_ICONS'
	| 'ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE'
	| 'ROLE_SUBSCRIPTIONS_ENABLED'
	| 'TICKETED_EVENTS_ENABLED'
	| 'VANITY_URL'
	| 'VERIFIED'
	| 'VIP_REGIONS'
	| 'WELCOME_SCREEN_ENABLED'

export declare type APIWelcomeScreen = {
	description?: string;
	welcome_channels: Array<APIWelcomeScreenChannel>;
};

export declare type APIWelcomeScreenChannel = {
	channel_id: string;
	description: string;
	emoji_id?: string;
	emoji_name: string;
};

export declare type APIGuild = {
	id: string;
	name: string;
	icon?: string;
	icon_hash?: string;
	splash?: string;
	discovery_splash?: string;
	owner?: boolean;
	owner_id: string;
	permissions?: string;
	region?: string;
	afk_channel_id?: string;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: Array<APIRole>;
	emojis: Array<APIEmoji>;
	features: Array<APIGuildFeatures>;
	mfa_level: number;
	application_id?: string;
	system_channel_id?: string;
	system_channel_flags: number;
	rules_channel_id?: string;
	max_presences?: number;
	max_members: number;
	vanity_url_code?: string;
	description?: string;
	banner?: string;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id?: string;
	max_video_channel_users?: number;
	max_stage_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: APIWelcomeScreen;
	nsfw_level: number;
	stickers?: Array<APISticker>;
	premium_progress_bar_enabled: boolean;
	safety_alerts_channel_id?: string;
};

export declare type APIPermissionOverwrite = {
	id: string;
	type: number;
	allow: string;
	deny: string;
};

export enum APIChannelTypes {
	GUILD_TEXT = 0,
	DM = 1,
	GUILD_VOICE = 2,
	GROUP_DM = 3,
	GUILD_CATEGORY = 4,
	GUILD_ANNOUNCEMENT = 5,
	ANNOUNCEMENT_THREAD = 10,
	PUBLIC_THREAD = 11,
	PRIVATE_THREAD = 12,
	GUILD_STAGE_VOICE = 13,
	GUILD_DIRECTORY = 14,
	GUILD_FORUM = 15,
	GUILD_MEDIA = 16
};

export declare type APIThreadMember = {
	id: string;
	user_id: string;
	join_timestamp: string;
	flags: number;
	member?: APIMember;
};

export declare type APIThreadMetadata = {
	archived: boolean;
	auto_archive_duration: number;
	archive_timestamp: string;
	locked: boolean;
	invitable?: boolean;
	create_timestamp?: string;
};

export declare type APIForumTag = {
	id: string;
	name: string;
	moderated: boolean;
	emoji_id?: string;
	emoji_name?: string;
};

export declare type APIDefaultReaction = {
	emoji_id?: string;
	emoji_name?: string;
};

export declare type APIChannel = {
	id: string;
	type: APIChannelTypes;
	guild_id?: string;
	position?: number;
	permission_overwrites?: Array<APIPermissionOverwrite>;
	name?: string;
	topic?: string;
	nsfw: boolean;
	last_message_id?: string;
	bitrate?: number;
	user_limit?: number;
	rate_limit_per_user?: number;
	recipients?: Array<APIUser>;
	icon?: string;
	owner_id?: string;
	application_id?: string;
	managed?: boolean;
	parent_id?: string;
	last_pin_timestamp?: string;
	rtc_region?: string;
	video_quality_mode?: number;
	message_count?: number;
	member_count?: number;
	thread_metadata?: APIThreadMetadata;
	member?: APIThreadMember;
	default_auto_archive_duration?: number;
	permissions?: string;
	flags?: number;
	total_message_sent?: number;
	available_tags?: Array<APIForumTag>;
	applied_tags?: Array<string>;
	default_reaction_emoji?: APIDefaultReaction;
	default_thread_rate_limit_per_user?: number;
	default_sort_order?: number;
	default_forum_layout?: number;
};