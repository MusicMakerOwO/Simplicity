import Client from '../../Client';
import Sticker from '../../Objects/Sticker';
import { APISticker } from '../../APITypes/Objects';
import Endpoints from '../../APITypes/Endpoints/Sticker';
import ResolveEndpoint from '../../Utils/ResolveEndpoint';

import Helper from '../Helper';

export default class GuildStickerHelper extends Helper {
	#client: Client;
	constructor(client: Client, guildID: string, stickers: Array<APISticker>) {
		super(guildID);
		this.#client = client;

		for (const sticker of stickers) {
			this.cache.set(sticker.id, this.#WrapInClass(sticker));
		}
	}

	#WrapInClass(data: APISticker): Sticker | undefined {
		if (!data) return undefined;
		return new Sticker(data);
	}

	override set(id: string, sticker: APISticker): this {
		this.#client.stickers.set(`${this.guildID}::${id}`, sticker);
		this.cache.set(id, this.#WrapInClass(sticker));
		return this;
	}

	override async get(id: string): Promise<Sticker | undefined> {
		return this.cache.get(id) as Sticker ?? await this.#client.stickers.get(`${this.guildID}::${id}`);
	}

	override async getAll(): Promise<Sticker[]> {
		const endpoint = ResolveEndpoint(Endpoints.GET_STICKERS, { guild: { id: this.guildID } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as APISticker[];
		data.forEach(sticker => this.set(sticker.id, sticker));
		const stickers = data.map(sticker => new Sticker(sticker));
		return stickers;
	}

	override async fetch(id: string): Promise<Sticker | undefined> {
		if (!id) throw new Error('Sticker ID is required - If trying to fetch everything, use getAll()');
		const endpoint = ResolveEndpoint(Endpoints.GET_STICKER, { guild: { id: this.guildID }, sticker: { id } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as APISticker;
		const sticker = this.#WrapInClass(data);
		this.set(data.id, data);
		return sticker;
	}
}

