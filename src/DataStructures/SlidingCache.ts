import Client from '../Client';
import ClientCache from './ClientCache';
import ResolveEndpoint from '../Utils/ResolveEndpoint';

export default class SlidingCache<TIn extends { id: string }, TOut extends { id: string }> extends Map<string, TIn> {
	#client: Client;
	public readonly cacheLookup: string;
	public readonly guildID: string;
	public readonly endpoint: string;
	public readonly bulkEndpoint: string;
	public readonly exportClass: new (client: Client, data: TIn) => TOut;
	public readonly endpointKey: string;

	// new SlidingCache<APIRole, Role>(client, client.roles, guildID, Endpoints.GET_ROLE, RoleEndpoints.GET_ROLES, Role, endpointKey)
	constructor(
		client: Client,
		cacheLookup: string,
		guildID: string,
		endpoint: string,
		bulkEndpoint: string,
		exportClass: new (client: Client, data: TIn) => TOut,
		endpointKey: string
	) {
		super();
		this.#client = client;
		this.cacheLookup = cacheLookup;
		this.guildID = guildID;
		this.endpoint = endpoint;
		this.bulkEndpoint = bulkEndpoint;
		this.exportClass = exportClass;
		this.endpointKey = endpointKey;
	}

	get #cache(): ClientCache<TIn, TOut> {
		// @ts-ignore
		const cache = this.#client[this.cacheLookup];
		if (!cache || !(cache instanceof ClientCache)) throw new Error(`Invalid cache lookup : ${this.cacheLookup}`);
		return cache;
	}

	#WrapInClass(data?: TIn): TOut | undefined {
		if (!data) return undefined;
		if (data instanceof this.exportClass) return data as TOut;
		return new this.exportClass(this.#client, data);
	}

	override set(id: string, data: TIn): this {
		throw new Error('Cannot set data in this method, use the primary cache instead');
	}

	// @ts-ignore
	override get(id: string): TOut | undefined {
		return this.#cache.getSync(`${this.guildID}::${id}`);
	}

	async getAll(): Promise<TOut[]> {
		const data = await this.#client.wsClient.SendRequest('GET', this.bulkEndpoint) as TIn[];
		for (const role of data) {
			this.set(role.id, role);
		}
		if (!data) return [];
		if (!data.length) return [];
		return data.map(this.#WrapInClass) as TOut[];
	}

	async fetch(id: string): Promise<TOut | undefined> {
		if (!id) throw new Error('ID is required - If trying to fetch everything, use getAll()');
		const fullEndpoit = ResolveEndpoint(this.endpoint, { guild_id: this.guildID, [this.endpointKey]: id });
		const data = await this.#client.wsClient.SendRequest('GET', fullEndpoit) as TIn;
		
		const output = this.#WrapInClass(data);
		this.set(id, data);
		return output;
	}
}
module.exports = exports.default;