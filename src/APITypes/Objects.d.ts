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

/*
id	snowflake	id of the message
channel_id	snowflake	id of the channel the message was sent in
author [1]	user object	the author of this message (not guaranteed to be a valid user, see below)
content [2]	string	contents of the message
timestamp	ISO8601 timestamp	when this message was sent
edited_timestamp	?ISO8601 timestamp	when this message was edited (or null if never)
tts	boolean	whether this was a TTS message
mention_everyone	boolean	whether this message mentions everyone
mentions	array of user objects	users specifically mentioned in the message
mention_roles	array of role object ids	roles specifically mentioned in this message
mention_channels? [3]	array of channel mention objects	channels specifically mentioned in this message
attachments [2]	array of attachment objects	any attached files
embeds [2]	array of embed objects	any embedded content
reactions?	array of reaction objects	reactions to the message
nonce?	integer or string	used for validating a message was sent
pinned	boolean	whether this message is pinned
webhook_id?	snowflake	if the message is generated by a webhook, this is the webhook's id
type	integer	type of message
activity?	message activity object	sent with Rich Presence-related chat embeds
application?	partial application object	sent with Rich Presence-related chat embeds
application_id?	snowflake	if the message is an Interaction or application-owned webhook, this is the id of the application
flags?	integer	message flags combined as a bitfield
message_reference?	message reference object	data showing the source of a crosspost, channel follow add, pin, or reply message
message_snapshots? [5]	array of message snapshot objects	the message associated with the message_reference. This is a minimal subset of fields in a message (e.g. author is excluded.)
referenced_message? [4]	?message object	the message associated with the message_reference
interaction_metadata?	message interaction metadata object	In preview. Sent if the message is sent as a result of an interaction
interaction?	message interaction object	Deprecated in favor of interaction_metadata; sent if the message is a response to an interaction
thread?	channel object	the thread that was started from this message, includes thread member object
components? [2]	array of message components	sent if the message contains components like buttons, action rows, or other interactive components
sticker_items?	array of message sticker item objects	sent if the message contains stickers
stickers?	array of sticker objects	Deprecated the stickers sent with the message
position?	integer	A generally increasing integer (there may be gaps or duplicates) that represents the approximate position of the message in a thread, it can be used to estimate the relative position of the message in a thread in company with total_message_sent on parent thread
role_subscription_data?	role subscription data object	data of the role subscription purchase or renewal that prompted this ROLE_SUBSCRIPTION_PURCHASE message
resolved?	resolved data	data for users, members, channels, and roles in the message's auto-populated select menus
poll? [2]	poll object	A poll!
call?	message call object	the call associated with the message
*/

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

export declare type APIMessageReaction = {
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
	components?: Array<any>;
	sticker_items?: Array<APIMessageStickerItems>;
	stickers?: Array<APISticker>;
	position?: number;
	role_subscription_data?: APIRoleSubscriptionData;
	resolved?: APIResolvedData;
	poll?: APIPoll;
	call?: APIMessageCall;
};