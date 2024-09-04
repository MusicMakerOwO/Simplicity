import LRUCache from './LRUCache';

declare type ClassConstructor<T> = new (...args: any[]) => T;

export default class ClientCache<T> {
	public readonly maxSize: number;
	public readonly exportClass: ClassConstructor<T>;
	public readonly endpoint: string;
	public readonly cache: LRUCache<string, T>;

	constructor(maxSize: number, exportClass: ClassConstructor<T>, endpoint: string) {
		this.maxSize = maxSize;
		this.exportClass = exportClass;
		this.endpoint = endpoint;
		this.cache = new LRUCache<string, T>(maxSize);
	}

	#WrapInClass(data: any): T | undefined {
		if (!data) return undefined;
		return new this.exportClass(data);
	}

	async get(key: string, options: { cache?: boolean } = {}): Promise<T | undefined> {
		if (options.cache === true) return this.#WrapInClass(this.cache.get(key));
		if (options.cache === false) return this.#WrapInClass(await this.fetch(key));

		if (this.cache.has(key)) return this.#WrapInClass(this.cache.get(key));
		
		const data = await this.fetch(key);
		if (!data) return undefined;
		this.cache.set(key, data);

		return this.#WrapInClass(data);
	}

	set(key: string, value: T): void {
		this.cache.set(key, value);
	}

	async fetch(key: string): Promise<T | undefined> {
		// TODO
		return undefined;
	}

	clear(): void {
		this.cache.clear();
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	toArray(): T[] {
		return this.cache.toArray();
	}

	get size(): number {
		return this.cache.size;
	}

	keys(): Array<string> {
		return Array.from(this.cache.keys());
	}

	values(): Array<T> {
		return this.toArray();
	}

	entries(): Array<[string, T]> {
		return Array.from(this.cache.entries());
	}

	[Symbol.iterator](): IterableIterator<T> {
		return this.values()[Symbol.iterator]();
	}


}
module.exports = exports.default;