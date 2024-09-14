// export declare type APISticker = {
// 	id: string;
// 	pack_id?: string;
// 	name: string;
// 	description?: string;
// 	tags: string;
// 	type: number;
// 	format_type: number;
// 	available?: boolean;
// 	guild_id?: string;
// 	user?: APIUser;
// 	sort_value?: number;
// };

import { APISticker, APIUser } from "../APITypes/Objects";
import Client from "../Client";

import User from "./User";

import SnowflakeToDate from "../Utils/SnowflakeToDate";

export default class Sticker {
	public readonly id: string;
	public readonly pack_id: string | undefined;
	public readonly name: string;
	public readonly description: string | undefined;
	public readonly tags: string;
	public readonly type: number;
	public readonly format_type: number;
	public readonly available: boolean | undefined;
	public readonly guild_id: string | undefined;
	public readonly user: User | undefined;
	public readonly sort_value: number | undefined;

	public readonly created_at: Date;

	constructor(client: Client, data: APISticker) {
		this.id = data.id;
		this.pack_id = data.pack_id;
		this.name = data.name;
		this.description = data.description;
		this.tags = data.tags;
		this.type = data.type;
		this.format_type = data.format_type;
		this.available = data.available;
		this.guild_id = data.guild_id;
		this.user = data.user ? new User(client, data.user as APIUser) : undefined;
		this.sort_value = data.sort_value;

		this.created_at = SnowflakeToDate(this.id);
	}

	getURL({ size = 256 }: { size?: number } = {}): string {
		return `https://cdn.discordapp.com/stickers/${this.id}.png?size=${size}`;
	}
}
module.exports = exports.default;