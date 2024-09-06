import Client from '../Client';
import LRUCache from './LRUCache';

declare type ClassConstructor<T> = new (...args: any[]) => T;

export default class ClientCache<TIn extends Object, TOut extends Object> {
	#client: Client;
	public readonly maxSize: number;
	public readonly exportClass: ClassConstructor<TOut>;
	public readonly endpoint: string;
	public readonly cache: LRUCache<string, TIn>;

	constructor(client: Client, maxSize: number, exportClass: ClassConstructor<TOut>, endpoint: string) {
		this.#client = client;
		this.maxSize = maxSize;
		this.exportClass = exportClass;
		this.endpoint = endpoint;
		this.cache = new LRUCache<string, TIn>(maxSize);
	}

	#WrapInClass(data: any): TOut | undefined {
		if (!data) return undefined;
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

	set(key: string, value: TIn): void {
		if ('unavailable' in value && value.unavailable === true) {
			this.cache.delete(key);
			return;
		}
		this.cache.set(key, value);
	}

	async fetch(key: string): Promise<TIn | undefined> {
		// TODO
		return undefined;
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


}
module.exports = exports.default;