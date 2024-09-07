import Client from '../../Client';
import Emoji from '../../Objects/Emoji';
import { APIEmoji } from '../../APITypes/Objects';
import Endpoints from '../../APITypes/Endpoints/Emojis';
import ResolveEndpoint from '../../Utils/ResolveEndpoint';

import Helper from '../Helper';

export default class GuildEmojiHelper extends Helper {
	#client: Client;
	constructor(client: Client, guildID: string, emojis: Array<APIEmoji>) {
		super(guildID);
		this.#client = client;

		for (const emoji of emojis) {
			this.cache.set(emoji.id, this.#WrapInClass(emoji));
		}
	}

	#WrapInClass(data: APIEmoji): Emoji | undefined {
		if (!data) return undefined;
		return new Emoji(data);
	}

	override set(id: string, emoji: APIEmoji): this {
		this.#client.emojis.set(`${this.guildID}::${id}`, emoji);
		this.cache.set(id, this.#WrapInClass(emoji));
		return this;
	}

	override async get(id: string): Promise<Emoji | undefined> {
		return this.cache.get(id) as Emoji ?? await this.#client.emojis.get(`${this.guildID}::${id}`);
	}

	override async getAll(): Promise<Emoji[]> {
		const endpoint = ResolveEndpoint(Endpoints.GET_EMOJIS, { guild: { id: this.guildID } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as APIEmoji[];
		data.forEach(emoji => this.set(emoji.id, emoji));
		const emojis = data.map(emoji => new Emoji(emoji));
		return emojis;
	}

	override async fetch(id: string): Promise<Emoji | undefined> {
		if (!id) throw new Error('Emoji ID is required - If trying to fetch everything, use getAll()');
		const endpoint = ResolveEndpoint(Endpoints.GET_EMOJI, { guild: { id: this.guildID }, emoji: { id } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as APIEmoji;
		const emoji = this.#WrapInClass(data);
		this.set(data.id, data);
		return emoji;
	}
}