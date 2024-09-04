import WSClient from "./WSClient";
import Events from "./Events";
import ResolveIntents from "./Utils/ResolveIntents";
import ClientCache from "./DataStructures/ClientCache";

function Range(min:number, value:number, max:number): number {
	return Math.max(min, Math.min(value, max));
}

const TOKEN_REGEX = /^(?:Bot )?([A-Za-z0-9_]{26}\.[A-Za-z0-9_]{6}\.[A-Za-z0-9_]{27)}$/;

export default class Client extends Events {
	#token: string;
	public ws: WSClient | null;
	public intents: bigint;

	public user: any;

	public guilds: ClientCache<Object>;

	constructor(options : { token: string, intents: number | string[], shards: number }) {
		super();

		options.shards = Range(1, Number(options.shards), 250);

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

		this.guilds = new ClientCache(1000, Object, '');
	}

	get token() {
		return this.#token.split('.').map((part, i) => i < 2 ? part : 'X'.repeat(part.length)).join('.');
	}

	connect(token?: string) {
		if (token) this.#token = token;
		if (!this.#token) throw new Error('No token provided, add it to the client constructor or pass it into this function');
		this.ws?.connect(this.#token);
	}
}
module.exports = exports.default;