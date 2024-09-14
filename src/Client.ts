import HTTPS from "node:https";

import WSClient from "./WSClient";
import Events from "./Events";
import ResolveIntents from "./Utils/ResolveIntents";
import ClientCache from "./DataStructures/ClientCache";
import SlashCommand from "./Builders/Commands/SlashCommand";

import GuildEndpoints from "./APITypes/Endpoints/Guilds";
import ChannelEndpoints from "./APITypes/Endpoints/Channels";
import RoleEndpoints from "./APITypes/Endpoints/Roles";
import UserEndpoints from "./APITypes/Endpoints/Users";
import EmojiEndpoints from "./APITypes/Endpoints/Emojis";
import StickerEndpoints from "./APITypes/Endpoints/Sticker";

import { APIGuild, APIChannel, APIRole, APIUser, APIEmoji, APISticker, APIMessage } from "./APITypes/Objects";

import User from "./Objects/User";
import Channel from "./Objects/Channel";
import Guild from "./Objects/Guild";
import Role from "./Objects/Role";
import Emoji from "./Objects/Emoji";
import Sticker from "./Objects/Sticker";
import Message from "./Objects/Message";

import Range from "./Utils/Range";
import ResolveEndpoint from "./Utils/ResolveEndpoint";
import CommandEndpoints from "./APITypes/Endpoints/Commands";

const TOKEN_REGEX = /^(?:Bot )?([A-Za-z0-9_-]{26}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{38})$/;

export default class Client extends Events {
	#token: string;
	public wsClient: WSClient | null;
	public intents: bigint;
	public connected_at: Date | null = null; // set in.wsClientClient
	public readonly id: string;

	public user: User | null = null;

	public guilds: ClientCache<APIGuild, Guild>;
	public channels: ClientCache<APIChannel, Channel>;
	public roles: ClientCache<APIRole, Role>;
	public users: ClientCache<APIUser, User>;
	public emojis: ClientCache<APIEmoji, Emoji>;
	public stickers: ClientCache<APISticker, Sticker>;
	public messages: ClientCache<APIMessage, Message>;

	constructor(options : { token: string, intents: number | string[], cacheSize?: number }) {
		super();

		options.cacheSize = Range(1, Number(options.cacheSize ?? 0), 100_000);
		if (options.cacheSize >= 10_000) {
			console.warn('Cache size is over 10,000 - This may cause excess memory usage and slow down your system');
			console.warn('Consider reducing the cache size or switching to separate sharding');
		}

		if (!options.token) throw new Error('No token provided');
		if (!options.intents) throw new Error('No intents provided');

		if (typeof options.token !== 'string') throw new Error('Invalid token value, must be a string');
		if (typeof options.intents !== 'number' && !Array.isArray(options.intents)) throw new Error('Invalid intents value, must be a number or an array of strings');

		if (typeof options.intents === 'number') {
			if (options.intents < 0 || options.intents > (1 << 25)) throw new Error(`Invalid intents value, must be between 0 and ${1 << 25}`);
		} else {
			if (options.intents.some((intent: string) => typeof intent !== 'string')) throw new Error('Invalid intents value, must be an array of strings');
		}

		const foundToken = options.token.match(TOKEN_REGEX);
		this.#token = foundToken ? foundToken[1] : '';
		this.intents = ResolveIntents(options.intents);
		this.wsClient = new WSClient(this);
		this.id = this.#ExtractIDFromToken(this.#token);

		this.guilds = new ClientCache(this, 2000, Guild, GuildEndpoints.GET_GUILD);
		this.channels = new ClientCache(this, 2000, Channel, ChannelEndpoints.GET_CHANNEL);
		this.roles = new ClientCache(this, 2000, Role, RoleEndpoints.GET_ROLE);
		this.users = new ClientCache(this, 2000, User, UserEndpoints.GET_USER);
		this.emojis = new ClientCache(this, 2000, Emoji, EmojiEndpoints.GET_EMOJI);
		this.stickers = new ClientCache(this, 2000, Sticker, StickerEndpoints.GET_STICKER);
		this.messages = new ClientCache(this, 10_000, Message, '');
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
		this.wsClient?.connect(this.#token);
	}

	disconnect = this.destroy;
	close = this.destroy;
	destroy() {
		this.wsClient?.close();
		this.wsClient = null;
		this.#token = '';
		this.user = null;
		this.guilds.clear();
		this.connected_at = null;
		this.intents = 0n;

		this.emit('events', 'Client destroyed');
		this.removeAllListeners();
	}


	// client.registerCommands(...commands, 'guildID');
	// client.registerCommands([...commands], 'guildID');
	async registerCommands(...args: Array<SlashCommand>) {
		args = args.flat(Infinity);

		var guildID = '';
		if (typeof args[args.length - 1] === 'string') {
			// @ts-ignore
			guildID = args.pop();
		}

		for (const command of args) {
			if (!(command instanceof SlashCommand)) throw new Error('Invalid command object');
		}

		if (!this.#token) throw new Error('No token provided');
		if (!this.id) throw new Error('No client ID provided');

		const payload = args.map(c => typeof c.toJSON === 'function' ? c.toJSON() : c);
		const endpoint = guildID ? CommandEndpoints.GUILD_BULK_OVERWRITE_COMMANDS : CommandEndpoints.GLOBAL_BULK_OVERWRITE_COMMANDS;
		
		const resolvedEndpoint = ResolveEndpoint(endpoint, { client: { id: this.id }, guild: { id: guildID } });

		return new Promise((resolve, reject) => {
			const req = HTTPS.request(resolvedEndpoint, {
				method: 'PUT',
				headers: {
					'Authorization': `Bot ${this.#token}`,
					'Content-Type': 'application/json'
				},
			})
			req.on('error', reject);
			req.on('response', (res) => {
				const data: Array<Buffer> = [];
				res.on('data', data.push.bind(data));
				res.on('end', () => {
					const parsed = JSON.parse(data.join(''));
					resolve(parsed);
				});
			});
			req.write(JSON.stringify(payload));
			req.end();
		});
	}
}
module.exports = exports.default;