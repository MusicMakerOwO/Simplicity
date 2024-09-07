/*
id	snowflake	guild id
name	string	guild name (2-100 characters, excluding trailing and leading whitespace)
icon	?string	icon hash
icon_hash?	?string	icon hash, returned when in the template object
splash	?string	splash hash
discovery_splash	?string	discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
owner? *	boolean	true if the user is the owner of the guild
owner_id	snowflake	id of owner
permissions? *	string	total permissions for the user in the guild (excludes overwrites and implicit permissions)
region? **	?string	voice region id for the guild (deprecated)
afk_channel_id	?snowflake	id of afk channel
afk_timeout	integer	afk timeout in seconds
widget_enabled?	boolean	true if the server widget is enabled
widget_channel_id?	?snowflake	the channel id that the widget will generate an invite to, or null if set to no invite
verification_level	integer	verification level required for the guild
default_message_notifications	integer	default message notifications level
explicit_content_filter	integer	explicit content filter level
roles	array of role objects	roles in the guild
emojis	array of emoji objects	custom guild emojis
features	array of guild feature strings	enabled guild features
mfa_level	integer	required MFA level for the guild
application_id	?snowflake	application id of the guild creator if it is bot-created
system_channel_id	?snowflake	the id of the channel where guild notices such as welcome messages and boost events are posted
system_channel_flags	integer	system channel flags
rules_channel_id	?snowflake	the id of the channel where Community guilds can display rules and/or guidelines
max_presences?	?integer	the maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
max_members?	integer	the maximum number of members for the guild
vanity_url_code	?string	the vanity url code for the guild
description	?string	the description of a guild
banner	?string	banner hash
premium_tier	integer	premium tier (Server Boost level)
premium_subscription_count?	integer	the number of boosts this guild currently has
preferred_locale	string	the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in interactions; defaults to "en-US"
public_updates_channel_id	?snowflake	the id of the channel where admins and moderators of Community guilds receive notices from Discord
max_video_channel_users?	integer	the maximum amount of users in a video channel
max_stage_video_channel_users?	integer	the maximum amount of users in a stage video channel
approximate_member_count?	integer	approximate number of members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds endpoints when with_counts is true
approximate_presence_count?	integer	approximate number of non-offline members in this guild, returned from the GET /guilds/<id> and /users/@me/guilds endpoints when with_counts is true
welcome_screen?	welcome screen object	the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
nsfw_level	integer	guild NSFW level
stickers?	array of sticker objects	custom guild stickers
premium_progress_bar_enabled	boolean	whether the guild has the boost progress bar enabled
safety_alerts_channel_id	?snowflake	the id of the channel where admins and moderators of Community guilds receive safety alerts from Discord
*/
import { APIGuild, APIEmoji, APISticker, APIWelcomeScreen } from "../APITypes/Objects";
import User from "./User";
import GuildRoleHelper from "../Helpers/Guilds/Roles";
import Client from "../Client";

export default class Guild {
	#client: Client;

	public readonly id: string;
	public readonly name: string;
	public readonly icon: string | undefined;
	public readonly splash: string | undefined;
	public readonly discovery_splash: string | undefined;
	public readonly owner: User | undefined;
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
	public readonly roles: GuildRoleHelper;
	public readonly emojis: Array<APIEmoji>;
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
	public readonly stickers: Array<APISticker>;
	public readonly premium_progress_bar_enabled: boolean;
	public readonly safety_alerts_channel_id: string | undefined;
	
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
		this.emojis = data.emojis;
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
		this.stickers = data.stickers ?? [];
		this.premium_progress_bar_enabled = data.premium_progress_bar_enabled;
		this.safety_alerts_channel_id = data.safety_alerts_channel_id;

		this.owner = client.users.getSync(this.owner_id);
		this.roles = new GuildRoleHelper(client, this.id, data.roles);
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
}
module.exports = exports.default;