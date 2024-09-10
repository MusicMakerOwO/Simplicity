export default class BitField {
	public bits: bigint;
	public flags: Record<string, bigint>;

	public _ALL: boolean;
	public _NONE: boolean;

	constructor(bits: number | bigint, flags: Record<string, bigint>) { // record = object
		this.bits = BigInt(bits);
		this.flags = flags;

		// these are here only to please the TS compiler lol
		this._ALL = false;
		this._NONE = false;
		
		// initalize values
		this.update();
	}

	update() {
		for (const flag in this.flags) {
			Object.defineProperty(this, flag, {
				value: this.has(flag),
				enumerable: true,
				configurable: true
			});
		}
		this._NONE = this.bits === BigInt(0);
		this._ALL = !this._NONE;
	}

	has(flag: string) {
		return Boolean(this.flags[flag] & this.bits);
	}

	set(flag: string, enabled: boolean) {
		if (enabled) {
			this.bits |= this.flags[flag];
		} else {
			this.bits &= ~this.flags[flag];
		}
		this.update();
	}

	serialize() {
		return this.bits.toString();
	}

	toString() {
		return this.bits.toString();
	}

	static deserialize(data: string | bigint, flags: Record<string, bigint>) {
		return new BitField(BigInt(data), flags);
	}

	static from(data: string | bigint, flags: Record<string, bigint>) {
		return new BitField(BigInt(data), flags);
	}

}
module.exports = exports.default;