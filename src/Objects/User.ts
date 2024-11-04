/*
id	snowflake	the user's id	identify
username	string	the user's username, not unique across the platform	identify
discriminator	string	the user's Discord-tag	identify
global_name	?string	the user's display name, if it is set. For bots, this is the application name	identify
avatar	?string	the user's avatar hash	identify
bot?	boolean	whether the user belongs to an OAuth2 application	identify
system?	boolean	whether the user is an Official Discord System user (part of the urgent message system)	identify
mfa_enabled?	boolean	whether the user has two factor enabled on their account	identify
banner?	?string	the user's banner hash	identify
accent_color?	?integer	the user's banner color encoded as an integer representation of hexadecimal color code	identify
locale?	string	the user's chosen language option	identify
verified?	boolean	whether the email on this account has been verified	email
email?	?string	the user's email	email
flags?	integer	the flags on a user's account	identify
premium_type?	integer	the type of Nitro subscription on a user's account	identify
public_flags?	integer	the public flags on a user's account	identify
avatar_decoration_data?	?avatar decoration data object	data for the user's avatar decoration	identify
*/

import Client from "../Client";

import BitField from "../DataStructures/BitField";
import UserFlags from "../Enums/UserFlags";
import NitroSubscriptions from "../Enums/NitroSubscriptions";
import { APIUser, APIAvatarDecoration } from "../APITypes/Objects";

import SnowflakeToDate from "../Utils/SnowflakeToDate";

export default class User {
	#client: Client;

	public readonly id: string;
	public readonly username: string;
	public readonly discriminator: string;
	public readonly global_name: string | undefined;
	public readonly avatar: string | undefined;
	public readonly bot: boolean | undefined;
	public readonly system: boolean;
	public readonly mfa_enabled: boolean;
	public readonly banner: string | undefined;
	public readonly accent_color: number | undefined;
	public readonly locale: string | undefined;
	public readonly verified: boolean | undefined;
	public readonly email: string | undefined;
	public readonly flags: BitField;
	public readonly nitro_subscription: string;
	public readonly public_flags: BitField;
	public readonly avatar_decoration_data: APIAvatarDecoration | null;

	public readonly created_at: Date;

	#defaultAvatarID: number;

	constructor(client: Client, data: APIUser) {

		this.#client = client;
		this.#client;

		this.id = data.id;
		this.username = data.username;
		this.discriminator = data.discriminator;
		this.global_name = data.global_name;
		this.avatar = data.avatar;
		this.bot = Boolean(data.bot);
		this.system = Boolean(data.system);
		this.mfa_enabled = Boolean(data.mfa_enabled);
		this.banner = data.banner;
		this.accent_color = data.accent_color;
		this.locale = data.locale;
		this.verified = Boolean(data.verified);
		this.email = data.email;
		this.flags = new BitField(data.flags ?? 0, UserFlags as Record<string, number>);
		this.nitro_subscription = NitroSubscriptions[data.premium_type ?? 0];
		this.public_flags = new BitField(data.public_flags ?? 0, UserFlags as Record<string, number>);
		this.avatar_decoration_data = data.avatar_decoration_data ?? null;

		this.created_at = SnowflakeToDate(this.id);

		this.#defaultAvatarID = this.discriminator === '0'
			? Number(BigInt(this.id) >> 22n) % 6
			: Number(this.discriminator) % 5;
	}

	static equals(user1: Object & { id: string }, user2: Object & { id: string }): boolean {
		return user1.id === user2.id;
	}

	equals(user: Object & { id: string }): boolean {
		return User.equals(this, user);
	}

	get tag(): string {
		return `${this.username}#${this.discriminator}`;
	}

	get display_name(): string {
		return this.global_name ?? this.username;
	}

	avatarURL(options: { dynamic?: boolean, size?: number } = { dynamic: true, size: 128 }): string {
		if (!this.avatar) return `https://cdn.discordapp.com/embed/avatars/${this.#defaultAvatarID}.png?size=${options.size}`;

		const avatarHash = options.dynamic ? this.avatar : this.avatar.replace(/a_/, '');
		return `https://cdn.discordapp.com/avatars/${this.id}/${avatarHash}.png?size=${options.size}`;
	}

	bannerURL(): string | undefined {
		return this.banner ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.png` : undefined;
	}

	get accent_color_hex(): string | undefined {
		return this.accent_color ? `#${this.accent_color.toString(16).padStart(6, '0')}` : undefined;
	}

	toString(): string {
		return `<@${this.id}>`;
	}
}
module.exports = exports.default;