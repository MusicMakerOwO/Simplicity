import Sticker from './Sticker';
import { APIStickerPack } from '../APITypes/Objects';
import Client from '../Client';

import SnowflakeToDate from '../Utils/SnowflakeToDate';

export default class StickerPack {
	#client: Client;

	public readonly id: string;
	public readonly name: string;
	public readonly description: string | null;
	public readonly cover_sticker_id: string | null;
	public readonly stickers: { [key: string]: Sticker } = {};
	public readonly sku_id: string | null;
	public readonly cover_sticker: Sticker | null = null;

	public readonly createdAt: Date = new Date();

	constructor(client: Client, data: APIStickerPack) {
		this.#client = client;
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.cover_sticker_id = data.cover_sticker_id ?? null;
		this.sku_id = data.sku_id;

		for (const sticker of data.stickers) {
			this.#client.stickers.set(sticker.id, sticker);
			this.stickers[sticker.id] = new Sticker(client, sticker);
		}

		if (data.cover_sticker_id) {
			this.cover_sticker = this.stickers[data.cover_sticker_id];
		}

		this.createdAt = SnowflakeToDate(this.id);
	}
}