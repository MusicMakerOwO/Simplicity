export default class BitField {
	public bits: number;
	public flags: Record<string, number>;

	public _ALL: boolean;
	public _NONE: boolean;

	constructor(bits: number, flags: Record<string, number>) { // record = object
		this.bits = Number(bits);
		this.flags = flags;

		if (isNaN(this.bits)) throw new TypeError('Invalid bits - NaN is not a number');
		if (this.bits < 0) throw new TypeError('Invalid bits - Negative numbers are not allowed');
		if (this.bits > Number.MAX_SAFE_INTEGER) throw new TypeError('Invalid bits - Number exceeds MAX_SAFE_INTEGER and will cause precision loss and destroy your data');


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
		this._NONE = this.bits === 0;
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

	static deserialize(data: number, flags: Record<string, number>) {
		return new BitField(data, flags);
	}

	static from(data: number, flags: Record<string, number>) {
		return new BitField(data, flags);
	}

}
module.exports = exports.default;