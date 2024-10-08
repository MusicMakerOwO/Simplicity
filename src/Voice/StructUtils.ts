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

	static CreateVarInt(value: number) : Buffer {
		let size = 0b00;
		if (value > 0x00FF) size = 0b01;
		if (value > 0xFFFF) size = 0b10;
		const buffer = Buffer.alloc(size + 1);
		buffer.writeUInt8(size << 6 | (value & 0b00111111), 0);
		buffer.writeUIntBE(value, 1, size);
		return buffer;
	}

	static CreateOptional(data = Buffer.alloc(0)) : Buffer {
		const value = data.length > 0;
		const buffer = Buffer.alloc(1 + data.length);
		buffer.writeUInt8(value ? 1 : 0, 0);
		data.copy(buffer, 1);
		return buffer;
	}
}
module.exports = exports.default;