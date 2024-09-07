import WSClient from "./WSClient";
import Events from "./Events";
import ResolveIntents from "./Utils/ResolveIntents";
import ClientCache from "./DataStructures/ClientCache";
import GuildEndpoints from "./APITypes/Endpoints/Guilds";
import RoleEndpoints from "./APITypes/Endpoints/Roles";
import UserEndpoints from "./APITypes/Endpoints/Users";
import EmojiEndpoints from "./APITypes/Endpoints/Emojis";
import StickerEndpoints from "./APITypes/Endpoints/Sticker";
import { APIUser, APIRole, APIGuild, APIChannel, APIEmoji, APISticker } from "./APITypes/Objects";

import User from "./Objects/User";
import Guild from "./Objects/Guild";
import Role from "./Objects/Role";
import Emoji from "./Objects/Emoji";
import Sticker from "./Objects/Sticker";

import Range from "./Utils/Range";

const TOKEN_REGEX = /^(?:Bot )?([A-Za-z0-9_]{26}\.[A-Za-z0-9_]{6}\.[A-Za-z0-9_]{38})$/;

export default class Client extends Events {
	#token: string;
	public ws: WSClient | null;
	public intents: bigint;
	public connected_at: Date | null = null; // set in WSClient
	public readonly id: string;

	public user: User | null = null;

	public guilds: ClientCache<APIGuild, Guild>;
	public channels: ClientCache<APIChannel, Object>; // coming soon lol
	public roles: ClientCache<APIRole, Role>;
	public users: ClientCache<APIUser, User>;
	public emojis: ClientCache<APIEmoji, Emoji>;
	public stickers: ClientCache<APISticker, Sticker>;

	constructor(options : { token: string, intents: number | string[], shards: number }) {
		super();

		options.shards = Range(1, Number(options.shards ?? 0), 250);

		if (!options.token) throw new Error('No token provided');
		if (!options.intents) throw new Error('No intents provided');
		if (!options.shards) throw new Error('No shards provided');

		if (typeof options.token !== 'string') throw new Error('Invalid token value, must be a string');
		if (typeof options.shards !== 'number') throw new Error('Invalid shards value, must be a number');
		if (typeof options.intents !== 'number' && !Array.isArray(options.intents)) throw new Error('Invalid intents value, must be a number or an array of strings');

		if (typeof options.intents === 'number') {
			if (options.intents < 0 || options.intents > (1 << 25)) throw new Error(`Invalid intents value, must be between 0 and ${1 << 25}`);
		} else {
			if (options.intents.some((intent: string) => typeof intent !== 'string')) throw new Error('Invalid intents value, must be an array of strings');
		}

		const foundToken = options.token.match(TOKEN_REGEX);
		this.#token = foundToken ? foundToken[1] : '';
		this.intents = ResolveIntents(options.intents);
		this.ws = new WSClient(this);
		this.id = this.#ExtractIDFromToken(this.#token);

		this.guilds = new ClientCache(this, 1000, Guild, GuildEndpoints.GET_GUILD);
		this.channels = new ClientCache(this, 1000, Object, '');
		this.roles = new ClientCache(this, 1000, Role, RoleEndpoints.GET_ROLE);
		this.users = new ClientCache(this, 1000, User, UserEndpoints.GET_USER);
		this.emojis = new ClientCache(this, 1000, Emoji, EmojiEndpoints.GET_EMOJI);
		this.stickers = new ClientCache(this, 1000, Sticker, StickerEndpoints.GET_STICKER);
	}

	#ExtractIDFromToken(token: string): string {
		// Base64(clientID).Base64(timestamp).Base64(random)
		const parts = token.split('.');
		if (parts.length !== 3) throw new Error('Invalid token format');
		return Buffer.from(parts[0], 'base64').toString();
	}

	get token() {
		return this.#token.split('.').map((part, i) => i < 2 ? part : 'X'.repeat(part.length)).join('.');
	}

	login = this.connect;
	connect(token?: string) {
		if (token) this.#token = token;
		if (!this.#token) throw new Error('No token provided, add it to the client constructor or pass it into this function');
		this.ws?.connect(this.#token);
	}

	disconnect = this.destroy;
	close = this.destroy;
	destroy() {
		this.ws?.ws?.close();
		this.ws = null;
		this.#token = '';
		this.user = null;
		this.guilds.clear();
		this.connected_at = null;
		this.intents = 0n;

		this.emit('events', 'Client destroyed');
		this.removeAllListeners();
	}
}
module.exports = exports.default;