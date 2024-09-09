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

export declare type APIEmbedFooter = {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export declare type APIEmbedImage = {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export declare type APIEmbedThumbnail = {
	url: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

export declare type APIEmbedVideo = {
	url?: string;
	height?: number;
	width?: number;
}

export declare type APIEmbedProvider = {
	name?: string;
	url?: string;
}

export declare type APIEmbedAuthor = {
	name: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

export declare type APIEmbedField = {
	name: string;
	value: string;
	inline?: boolean;
}

export declare type APIEmbed = {
	title?: string;
	type?: string;
	description?: string;
	url?: string;
	timestamp?: string;
	color?: number;
	footer?: APIEmbedFooter;
	image?: APIEmbedImage;
	thumbnail?: APIEmbedThumbnail;
	video?: APIEmbedVideo;
	provider?: APIEmbedProvider;
	author?: APIEmbedAuthor;
	fields?: Array<APIEmbedField>;
}

export declare type APIAttachment = {
	id: string;
	filename: string;
	title?: string;
	description?: string;
	content_type?: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number;
	width?: number;
	ephemeral?: boolean;
	duration_secs?: number;
	waveform?: string;
	flags?: number;
}

export declare type APIReaction = {
	count: number;
	count_details: {
		burst: number; // super reactions
		normal: number;
	}
	me: boolean;
	me_burst: boolean;
	emoji: APIEmoji;
	burst_colors?: Array<number>;
};

export declare type APIMessageActivity = {
	type: number;
	party_id?: string;
};

export declare type APIMessageReference = {
	type?: number;
	message_id?: string;
	channel_id?: string;
	guild_id?: string;
	fail_if_not_exists?: boolean;
};

export declare type APIMessageInteractionMetadata = {
	id: string;
	type: number;
	user: APIUser;
	authorizing_integration_owners: Record<string, string>;
	original_response_message_id?: string;
	interacted_message_id?: string;
	triggering_interaction_metadata?: APIMessageInteractionMetadata;
};

export declare type APIMessageStickerItems = {
	id: string;
	name: string;
	format_type: number;
};

export declare type APISticker = {
	id: string;
	pack_id?: string;
	name: string;
	description?: string;
	tags: string;
	type: number;
	format_type: number;
	available?: boolean;
	guild_id?: string;
	user?: APIUser;
	sort_value?: number;
};

export declare type APIRoleSubscriptionData = {
	role_subscription_listing_id: string;
	tier_name: string;
	total_months_subscribed: number;
	is_renewal: boolean;
};

export declare type APIResolvedData = {
	users: Record<string, APIUser>;
	members: Record<string, APIMember>;
	channels: Record<string, APIChannel>;
	roles: Record<string, APIRole>;
};

export declare type APIPollAnswer = {
	answer_id: number;
	poll_media?: any;
}

export declare type APIPollResults = {
	id: number;
	count: number;
	me_voted: boolean;
}

export declare type APIPoll = {
	question: string;
	answers: Array<APIPollAnswer>;
	expiry?: string;
	allow_multiselect: boolean;
	layout_type: number;
	results?: APIPollResults;
};

export declare type APIMessageCall = {
	participants: Array<string>;
	ended_timestamp?: string;
};

export declare type APIMessageSnapshot = {
	message: APIMessage;
};

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

export declare type APIButton = {
	type: 2;
	style: 1 | 2 | 3 | 4 | 5 | 6;
	label: string;
	custom_id: string;
	disabled?: boolean;
	url?: string;
	emoji?: {
		name: string;
		id?: string;
	};
};

export declare type APISelectMenuOption = {
	label: string;
	value: string;
	description?: string;
	emoji?: {
		name: string;
		id?: string;
	};
	default?: boolean;
};

export declare type APISelectMenu = {
	type: 3;
	custom_id: string;
	placeholder: string;
	options: Array<APISelectMenuOption>;
	disabled?: boolean;
};

export declare type APIModalQuestion = {
	type: 4;
	style: 1 | 2;
	custom_id: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	min_length?: number;
	max_length?: number;
	value?: string;
};

export declare type Modal = {
	title: string;
	custom_id: string;
	components: Array<APIModalQuestion>;
};

export declare type APIActionRow = {
	type: 1;
	components: Array<APIButton | APISelectMenu | APIModalQuestion>;
};

export enum APIInteractionTypes {
	GUILD = 0,
	BOT_DM = 1,
	PRIVATE_CHANNEL = 2
}

export declare type APIInteraction = {
	id: string;
	application_id: string;
	type: number;
	data: APIInteractionData;
	guild?: APIGuild;
	guild_id: string;
	channel?: APIChannel;
	channel_id: string;
	member?: APIMember;
	user?: APIUser;
	token: string;
	version: number;
	message?: APIMessage;
	app_permissions: string;
	locale?: string;
	guild_locale: string;
	entitlements: Array<APIInteractionEntitlement>;
	authorizing_integration_owners: Record<string, string>;
	context: APIInteractionTypes;
};

export declare type APIInteractionData = {
	id: string;
	name: string;
	type: number;
	resolved: APIResolvedData;
	options: Array<APIInteractionOption>;
	guild_id: string;
	target_id: string;
};

export declare type APIResolvedData = {
	users: Record<string, APIUser>;
	members: Record<string, APIMember>;
	roles: Record<string, APIRole>;
	channels: Record<string, APIChannel>;
	messages: Record<string, APIMessage>;
	attachments: Record<string, APIAttachment>;
};

export declare type APIInteractionOption = {
	name: string;
	type: number;
	value?: string | number | boolean;
	options?: Array<APIInteractionOption>;
	focused?: boolean;
};

export declare type APIInteractionEntitlement = {
	id: string;
	sku_id: string;
	application_id: string;
	user_id?: string;
	type: number;
	deleted: boolean;
	starts_at?: string;
	ends_at?: string;
	guild_id?: string;
	consumed?: boolean;
};