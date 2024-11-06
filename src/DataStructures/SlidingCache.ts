import Client from '../Client';
import ClientCache from './ClientCache';
import ResolveEndpoint from '../Utils/ResolveEndpoint';

export default class SlidingCache<TIn extends { id: string }, TOut extends { id: string }> extends Map<string, TOut | undefined> {
	#client: Client;
	public readonly cache: ClientCache<TIn, TOut>;
	public readonly guildID: string;
	public readonly endpoint: string;
	public readonly bulkEndpoint: string;
	public readonly exportClass: new (client: Client, data: TIn) => TOut;
	public readonly endpointKey: string;

	// new SlidingCache<APIRole, Role>(client, client.roles, guildID, Endpoints.GET_ROLE, RoleEndpoints.GET_ROLES, Role, endpointKey)
	constructor(
		client: Client,
		cache: ClientCache<TIn, TOut>,
		guildID: string,
		endpoint: string,
		bulkEndpoint: string,
		exportClass: new (client: Client, data: TIn) => TOut,
		endpointKey: string
	) {
		super();
		this.#client = client;
		this.cache = cache;
		this.guildID = guildID;
		this.endpoint = endpoint;
		this.bulkEndpoint = bulkEndpoint;
		this.exportClass = exportClass;
		this.endpointKey = endpointKey;

		const primaryCacheKeys = Array.from(this.cache.cache.keys());
		for (let i = 0; i < primaryCacheKeys.length; i++) {
			const key = primaryCacheKeys[i];
			if (key.startsWith(this.guildID)) {
				const [,id] = key.split('-');
				this.set(id, this.cache.getSync(key));
			}
		}
	}

	#WrapInClass(data?: TIn): TOut | undefined {
		if (!data) return undefined;
		if (data instanceof this.exportClass) return data as TOut;
		return new this.exportClass(this.#client, data);
	}

	async fetch(id: string): Promise<TOut | undefined> {
		if (!id) throw new Error('ID is required - If trying to fetch everything');
		const fullEndpoit = ResolveEndpoint(this.endpoint, { guild_id: this.guildID, [this.endpointKey]: id });
		const data = await this.#client.wsClient.SendRequest('GET', fullEndpoit) as TIn;
		this.cache.set(id, data);
		
		const output = this.#WrapInClass(data);
		if (!output) return undefined;
		this.set(id, output);
		return output;
	}
}
module.exports = exports.default;