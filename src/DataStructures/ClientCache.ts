import Client from '../Client';
import LRUCache from './LRUCache';

import ResolveEndpoint from '../Utils/ResolveEndpoint';
import isClass from '../Utils/isClass';

declare type ClassConstructor<T> = new (...args: any[]) => T;

export default class ClientCache<TIn extends Object, TOut extends Object> {
	#client: Client;
	public readonly maxSize: number;
	public readonly exportClass: ClassConstructor<TOut>;
	public readonly endpointKey: string;
	public readonly endpoint: string;
	public readonly cache: LRUCache<string, TIn>;
	#name: string;
	public fullWarning: boolean;

	constructor(client: Client, maxSize: number, exportClass: ClassConstructor<TOut>, endpointKey: string, endpoint: string) {
		if (!isClass(exportClass)) throw new Error('exportClass must be a class constructor, received: ' + typeof exportClass);
		this.fullWarning = false;
		this.#name = exportClass.name;
		this.#client = client;
		this.maxSize = maxSize;
		this.exportClass = exportClass;
		this.endpointKey = endpointKey;
		this.endpoint = endpoint;
		this.cache = new LRUCache<string, TIn>(maxSize);
	}

	#WrapInClass(data: any): TOut | undefined {
		if (!data) return undefined;
		if (data instanceof this.exportClass) return data;
		return new this.exportClass(this.#client, data);
	}

	async get(key: string, options: { cache?: boolean } = {}): Promise<TOut | undefined> {
		if (options.cache === true) return this.#WrapInClass(this.cache.get(key));
		if (options.cache === false) return this.#WrapInClass(await this.fetch(key));

		if (this.cache.has(key)) return this.#WrapInClass(this.cache.get(key));
		
		const data = await this.fetch(key);
		if (!data) return undefined;
		this.cache.set(key, data);

		return this.#WrapInClass(data);
	}

	getSync(key: string): TOut | undefined {
		return this.#WrapInClass(this.cache.get(key));
	}

	WarnFullCache() {
		if (this.fullWarning || !this.endpoint) return;
		console.warn(`Cache for '${this.#name}s' is full, consider increasing the cache size. (${this.cache.size}/${this.maxSize})`);
		console.warn(`Endpoint: ${this.endpoint}`);
		this.fullWarning = true;
	}

	set(key: string, value: TIn): void {
		if ('unavailable' in value && value.unavailable === true) {
			this.cache.delete(key);
			return;
		}
		this.cache.set(key, value);
		if (this.cache.size >= this.maxSize) this.WarnFullCache();
	}

	// guildID-itemID
	async fetch(key: string): Promise<TIn | undefined> {
		if (!this.endpoint) return undefined;

		let [ guildID, itemID ] = key.split('-');
		if (!itemID) itemID = guildID;

		const endpoint = ResolveEndpoint(this.endpoint, { 'guild': { id: guildID }, [this.endpointKey]: { id: itemID } });
		const data = await this.#client.wsClient.SendRequest('GET', endpoint);
		if (!data) return undefined;

		// @ts-ignore
		this.cache.set(key, data);
		// @ts-ignore
		return this.#WrapInClass(data);
	}

	clear(): void {
		this.cache.clear();
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	toArray(): Array<TIn> {
		return this.cache.toArray();
	}

	get size(): number {
		return this.cache.size;
	}

	keys(): Array<string> {
		return Array.from(this.cache.keys());
	}

	values(): Array<TIn> {
		return this.toArray();
	}

	entries(): Array<[string, TIn]> {
		return Array.from(this.cache.entries());
	}

	[Symbol.iterator](): IterableIterator<TIn> {
		return this.values()[Symbol.iterator]();
	}

	isFull(): boolean {
		return this.cache.size >= this.maxSize;
	}
}
module.exports = exports.default;