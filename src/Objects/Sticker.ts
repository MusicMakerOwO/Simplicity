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

import { APISticker } from "../APITypes/Objects";

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
	public readonly user: any;
	public readonly sort_value: number | undefined;

	constructor(data: APISticker) {
		this.id = data.id;
		this.pack_id = data.pack_id;
		this.name = data.name;
		this.description = data.description;
		this.tags = data.tags;
		this.type = data.type;
		this.format_type = data.format_type;
		this.available = data.available;
		this.guild_id = data.guild_id;
		this.user = data.user;
		this.sort_value = data.sort_value;
	}

	getURL({ size = 256 }: { size?: number } = {}): string {
		return `https://cdn.discordapp.com/stickers/${this.id}.png?size=${size}`;
	}
}