export default class LRUCache<T, V> extends Map<T, V> {
	public maxSize: number;

	constructor(maxSize: number) {
		super();
		this.maxSize = Number(maxSize);
	}

	override set(key: T, value: V) : this {
		if (this.size >= this.maxSize) this.delete(this.keys().next().value);
		return super.set(key, value);
	}

	moveToHead(key: T, value: V) {
		super.delete(key);
		super.set(key, value);
	}

	override get(key: T): V | undefined {
		const value = super.get(key);
		if (value) this.moveToHead(key, value);
		return value;
	}

	toArray() {
		return Array.from(this.values());
	}
}
module.exports = exports.default;