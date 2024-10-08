// D.A.V.E. = Discord Autio + Video Encryption

// API Docs : https://discord.com/developers/docs/topics/voice-connections#endtoend-encryption-dave-protocol
// DAVE Protocol : https://daveprotocol.com/
// MLS Protocol : https://www.rfc-editor.org/rfc/rfc9420.htmlf

// End my suffering, please. I have no idea what I am doing.

import Crypto from "node:crypto";
import { UDP_Packet } from "./types";
import { UDP_OP_CODES } from "./enums";
import { GatewayPayload } from "../APITypes/GatewayTypes";

export default class DAVE {
	DECODERS: Map<number, (data: Buffer, sequence: number) => any>;

	#signingKeys: { public: string; private: string; };
	#encryptionKeys: { public: string; private: string; };

	constructor() {
		this.DECODERS = new Map();
		this.#signingKeys = this.generateKeyPair('signing');
		this.#encryptionKeys = this.generateKeyPair('encryption');
		this.#signingKeys;
		this.#encryptionKeys;
	}

	signPacket(data: Buffer | Object) : Buffer {
		if (!Buffer.isBuffer(data)) data = Buffer.from(JSON.stringify(data));
		// @ts-ignore
		return Crypto.sign(null, data, this.#signingKeys.private) as Buffer;
	}

	processInternalPacket(data: GatewayPayload) : void {
		// todo
	}

	decode(data: Buffer | GatewayPayload) : UDP_Packet {
		// @ts-ignore
		if (!Buffer.isBuffer(data)) return this.processInternalPacket(data);
		if (!Buffer.isBuffer(data)) throw new Error("UDP Packet must be a binary buffer, otherwise it is a GatewayPayload and is already decoded.");

		let op = data.readUInt8(0);
		let sequence = 0;
		if (!(op in UDP_OP_CODES)) {
			sequence = data.readUInt16BE(0);
			op = data.readUInt8(2);
		}
		const decoder = this.DECODERS.get(op);
		if (!decoder) throw new Error(`Unknown OP Code: ${op}`);
		const packet = decoder(data, sequence);
		return { op: op, data: packet };
	}

	deriveKey(secret: string, label: string, context: Buffer) : Buffer {
		return Crypto.createHmac("sha256", secret).update(label).update(context).digest();
	}

	generateKeyPair(mode: 'signing' | 'encryption') : { public: string, private: string } {
		// @ts-ignore
		const { publicKey, privateKey } = Crypto.generateKeyPairSync(mode === 'signing' ? 'ed25519' : 'x25519', {
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
		});
		return { public: publicKey, private: privateKey };
	}
}
module.exports = exports.default;