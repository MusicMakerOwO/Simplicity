export default class BitField {
	public bits: bigint;
	public flags: Record<string, bigint>;

	public ALL: boolean;
	public NONE: boolean;

	constructor(bits: number | bigint, flags: Record<string, bigint>) { // record = object
		this.bits = BigInt(bits);
		this.flags = flags;

		for (const flag of Object.keys(flags)) {
			Object.defineProperty(this, flag, {
				get: this.has.bind(this, flag),
				set: this.set.bind(this, flag)
			});
		}

		// these are here only to please the TS compiler lol
		this.ALL = false;
		this.NONE = false;
		
		// initalize values
		this.updateMeta();
	}

	updateMeta() {
		this.NONE = this.bits === BigInt(0);
		this.ALL = !this.NONE;
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
		this.updateMeta();
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