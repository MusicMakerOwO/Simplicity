export default class StructUtils {
	// https://www.rfc-editor.org/rfc/rfc9420.html#name-optional-value
	static Optional(data: Buffer, offset: number) : Boolean {
		return data.readUInt8(offset) > 0;
	}

	static INT_SIZES: Record<number, number> = {
		0b0000: 8,
		0b0001: 16,
		0b0010: 32
	}

	// https://www.rfc-editor.org/rfc/rfc9420.html#name-variable-size-vector-length
	static VarInt(data: Buffer, offset: number) : number {
		const value = data.readUInt8(offset);
		const flags = value >> 6; // 2 most significant bits
		const size = StructUtils.INT_SIZES[flags];
		if (!size) throw new Error(`Invalid VarInt size: ${flags}`);
		return data.readUIntBE(offset, size);
	}

	static VarString(data: Buffer, offset: number) : string {
		const length = data.readUInt8(offset++);
		return data.toString('utf8', offset, offset + length);
	}
}