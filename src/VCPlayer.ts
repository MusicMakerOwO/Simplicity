import fs from "node:fs";
import path from "node:path";

import Client from "./Client";
import Websocket from "./Websocket";
import UDP from "./UDP";
import { GatewayOPCodes, VoiceOPCodes } from "./APITypes/Enums";
import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";
import Range from "./Utils/Range";

// Interface for plugins to modify audio data before transmission
interface VoicePlugin {
	init(bitrate: number, bitdepth: number, samples: number): void; // Initialize the plugin and pass in audio settings
	process(audio: Float32Array): Float32Array; // Perform whatever operatoins on the audio data
	destroy(): void; // Cleanup
}

// optional dependencies
let wav: typeof import('node-wav') | undefined;
try {
	wav = require('node-wav');
} catch (e) { }

let mp3: typeof import('mpg123-decoder').MPEGDecoder | undefined;
try {
	mp3 = require('mpg123-decoder')?.MPEGDecoder;
} catch (e) { }

async function ReadMagicNumber(filePath: string) {
	const buffer = Buffer.alloc(12);
	const file = await fs.promises.open(filePath, 'r');
	await file.read(buffer, 0, 12, 0); // read first 12 bytes, not the whole file
	await file.close();
	return buffer;
}

const SIGNATURE_LOOKUP = {
	'52494646': 'wav',
	'FFFB'	  : 'mp3',
	'FFF3'	  : 'mp3',
	'FFF2'	  : 'mp3',
	'4F676753': 'ogg',
	'664C6143': 'flac'
}

function IdentityFormat(magicNumber: Buffer) {
	const signature = magicNumber.toString('hex', 0, 4);

	for (const [number, format] of Object.entries(SIGNATURE_LOOKUP)) {
		if (number === signature) return format;
	}

	return 'unknown';
}

function ConvertToMonoTrack(...channels: Float32Array[]) {
	const mono = new Float32Array(channels[0].length);
	for (let i = 0; i < channels[0].length; i++) {
		let sum = 0;
		for (const channel of channels) {
			sum += channel[i] ?? 0;
		}
		mono[i] = sum / channels.length;
	}
	return mono;
}

const IP_DISCOVERY_PACKET = Buffer.alloc(74);
IP_DISCOVERY_PACKET.writeUInt8(0x00, 0);
IP_DISCOVERY_PACKET.writeUInt8(0x01, 1);
IP_DISCOVERY_PACKET.writeUInt8(0x00, 2);
IP_DISCOVERY_PACKET.writeUInt8(70, 3);
for (let i = IP_DISCOVERY_PACKET.length; i < 74; i++) {
	IP_DISCOVERY_PACKET.writeUInt8(0);
}

const VOICE_PACKET_HEADER = Buffer.from([0x80, 0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

function ConvertUDPPayload(data: Buffer) {

	const initialValue = data.readUIntBE(0, 2);
	if (initialValue === 0x01 || initialValue === 0x02) {
		// IP discovery packet
		const response = data.readUIntBE(0, 2) === 0x00 ? 'request' : 'response';
		const length = data.readUIntBE(2, 2);
		const ssrc = data.readUIntBE(4, 4); // 32-bit integer unisgned
		const ip = data.toString('utf8', 8, 8 + length).split('\0')[0]; // null terminated string
		const port = data.readUIntBE(length - 2, 2); // 16-bit integer unsigned
		return {
			type: 'IP_DISCOVERY',
			response,
			length,
			ssrc,
			ip,
			port
		}
	}

	if (initialValue === VOICE_PACKET_HEADER.readUIntBE(0, 2)) {
		const version = data.readUIntBE(0, 1); // 0x80
		const payloadType = data.readUIntBE(1, 1); // 0x78
		const sequence = data.readUIntBE(2, 2); // 16-bit integer unsigned
		const timestamp = data.readUIntBE(4, 4); // 32-bit integer unsigned
		const ssrc = data.readUIntBE(8, 4);
		const payload = data.subarray(12, data.length);
		return {
			type: 'VOICE_PACKET',
			version,
			payloadType,
			sequence,
			timestamp,
			ssrc,
			payload // encrypted data, decrypted in the code
		}
	}

	return {
		type: 'UNKNOWN',
		data
	}

}

export default class VCPlayer {
	#client: Client;
	#ws: Websocket | null = null;
	#udp: UDP | null = null;
	#guildID: string;
	#channelID: string;
	#localIP: string = '';

	public readonly jitter = Math.random() * 0.5 + 0.5; // 0.5 -> 1.0

	public shardID: number = 0;
	public ssrc: number = 0;
	public ip: string = '';
	public port: number = 0;
	public modes: string[] = [];
	public sessionID: string = '';

	public heartbeatInterval: NodeJS.Timeout | null = null;

	public audioFile: Float32Array | null = null;
	public playback_volume: number = 100;
	public bitrate: number = 441000;
	public bitdepth: number = 16;

	public currently_playing: boolean = false;

	constructor(client: Client, shardID: number, guildID: string, channelID: string) {
		this.#client = client;
		this.#guildID = guildID;
		this.#channelID = channelID;
		this.shardID = shardID;
	}

	addPlugin(name: string, plugin: VoicePlugin) {
		this.#client.vcClient.addPlugin(name, plugin);
	}

	applyPlugin(name: string, options: unknown) {
		if (!this.audioFile) throw new Error('No audio file loaded - Use loadAudio() to load a file first');

		const plugin = this.#client.vcClient.plugins.get(name);
		if (!plugin) throw new Error(`No plugin with the name "${name}" exists`);
		
		plugin.init(this.bitrate, this.bitdepth, this.audioFile.length ?? 0);
		this.audioFile = plugin.process(this.audioFile, options);
	}

	joinChannel() {
		this.#client.wsClient.WSSend(this.shardID, {
			op: GatewayOPCodes.VOICE_STATE_UPDATE,
			d: {
				guild_id: this.#guildID,
				channel_id: this.#channelID,
				self_mute: false,
				self_deaf: false
			}
		});
	}

	SendHeartbeat() {
		this.#ws?.send({
			op: VoiceOPCodes.HEARTBEAT,
			d: Date.now()
		});
		console.log('Sent heartbeat');
	}

	#connectUDP() {
		this.#udp = new UDP(this.port, this.ip);

		this.#udp.send(IP_DISCOVERY_PACKET);
		this.#udp.on('message', (data: Buffer) => {
			const packet = ConvertUDPPayload(data);
			switch (packet.type) {
				case 'IP_DISCOVERY':
					this.#localIP = packet.ip as string;
					this.#ws?.send({
						op: VoiceOPCodes.SELECT_PROTOCOL,
						d: {
							protocol: 'udp',
							data: {
								address: this.#localIP,
								port: this.port,
								mode: this.modes[0]
							}
						}
					});
					break;
				case 'VOICE_PACKET':
					// coming soon
					break;
				case 'UNKNOWN':
					console.error('Unknown packet received');
					console.error(packet.data);
					break;
			}
		});
	}

	async connect(endpoint: string, token: string) {
		// todo: https://discord.com/developers/docs/topics/voice-connections#connecting-to-voice
		this.#ws = new Websocket(`wss://${endpoint}/?v=8`);

		this.#ws.on('send', console.log.bind(null, 'sent data :'));
		this.#ws.on('error', console.error.bind(null, 'error :'));
		this.#ws.on('close', console.log.bind(null, 'closed :'));
		this.#ws.on('open', console.log.bind(null, 'opened :'));

		this.#ws.on('message', (data: GatewayPayload | HelloEvent) => {
			if (data.op === VoiceOPCodes.HELLO) {
				data = data as HelloEvent;
				this.#ws?.send({
					op: VoiceOPCodes.IDENTIFY,
					d: {
						max_dave_protocol_version: 1,
						server_id: this.#guildID,
						user_id: this.#client.user?.id,
						session_id: this.sessionID,
						token: token
					}
				});
				this.heartbeatInterval = setInterval(this.SendHeartbeat.bind(this), data.d.heartbeat_interval * this.jitter);
			}

			if (data.op === VoiceOPCodes.READY) {
				data = data as GatewayPayload;
				
				this.ssrc = data.d.ssrc;
				this.ip = data.d.ip;
				this.port = data.d.port;
				this.modes = data.d.modes;

				this.#connectUDP();
			}

			console.log(`Received ${data.op} : ${VoiceOPCodes[data.op]} event`);
			console.log(data);
		});
	}

	static SUPPORTED_FORMATS = ['wav', 'mp3'];
	static PENDING_FORMATS = ['ogg', 'flac'];

	async loadAudio(buffer: Buffer, bitrate?: number, bitdepth?: number) : Promise<void>;
	async loadAudio(filePath: string) : Promise<void>;
	async loadAudio(pathOrBuffer: string | Buffer, bitrate?: number, bitdepth?: number) {
		if (Buffer.isBuffer(pathOrBuffer)) {

			bitrate ??= 8000;
			bitdepth ??= 16;
			bitdepth = Math.pow(2, Math.round(Math.log2(bitdepth))); // lock to a power of 2

			this.bitrate = Range(8000, Number(bitrate), 44100);
			this.bitdepth = Range(8, Number(bitdepth), 16);

			const audioData = new Float32Array(pathOrBuffer.length / (this.bitdepth / 8));
			for (let i = 0; i < pathOrBuffer.length; i += this.bitdepth / 8) {
				const value1 = pathOrBuffer.readInt16LE(i);
				const value2 = pathOrBuffer.readInt16LE(i + 2);
				// if depth is 8, then the value1 is the only value
				const value = this.bitdepth === 8 ? value1 : (value1 << 16) | value2;
				audioData[i] = this.bitdepth === 8 ? value / 128 : value / 32768;
			}
			this.audioFile = audioData;
			return;
		}

		const extension = pathOrBuffer.split('.').pop();
		if (!extension) throw new Error('A file extension is required to load an audio file');

		const fullPath = pathOrBuffer.startsWith('/')
			? pathOrBuffer
			: path.resolve(process.cwd(), pathOrBuffer);

		const magicNumber = await ReadMagicNumber(fullPath);
		const format = IdentityFormat(magicNumber);
		if (format === 'unknown') throw new Error(`Unknown audio format - Supported formats are ${VCPlayer.SUPPORTED_FORMATS.join(', ')}`);

		if (!VCPlayer.SUPPORTED_FORMATS.includes(format)) {
			if (!VCPlayer.PENDING_FORMATS.includes(format)) throw new Error(`Unsupported audio format - Supported formats are ${VCPlayer.SUPPORTED_FORMATS.join(', ')}`);
			throw new Error(`Support for ${format} is pending - Check back later`);
		}

		if (format === 'wav') {
			if (!wav) throw new Error('node-wav is not installed - Run `npm install node-wav` to install it');
			const buffer = await fs.promises.readFile(fullPath);
			const decoded = wav.decode(buffer);
			this.audioFile = ConvertToMonoTrack(...decoded.channelData);
			this.bitrate = decoded.sampleRate;
			return;
		}

		if (format === 'mp3') {
			if (!mp3) throw new Error('mpg123-decoder is not installed - Run `npm install mpg123-decoder` to install it');
			const decoder = new mp3();
			await decoder.ready; // wait for WASM to load
			const buffer = await fs.promises.readFile(fullPath);
			const decoded = decoder.decode(buffer);
			this.audioFile = ConvertToMonoTrack(...decoded.channelData);
			this.bitrate = decoded.sampleRate;
			return;
		}
	}

	play() {
		if (!this.audioFile) throw new Error('No audio file loaded - Use loadAudio() to load a file first');
		
		if (this.currently_playing) return;
		this.currently_playing = true;
		
		// start playing the audio
	}

	pause() {
		if (!this.currently_playing) return;
		this.currently_playing = false;
	}

	restart() {
		// restart the audio
	}

	stop() {
		if (!this.audioFile) return;
		this.currently_playing = false;
		this.audioFile = null;
	}

	volume(volume: number) {
		if (volume < 0 || volume > 100) throw new RangeError('Volume must be between 0 and 100');
		this.playback_volume = volume / 100; // lock between 0 and 1 for higher precision
	}

	async disconnect() {
		this.#client.wsClient.WSSend(this.shardID, {
			op: GatewayOPCodes.VOICE_STATE_UPDATE,
			d: {
				guild_id: this.#guildID,
				channel_id: null,
				self_mute: false,
				self_deaf: false
			}
		});
	}

	async destroy() {
		this.#udp?.close();
		this.#ws?.close();
		this.#udp = null;
		this.#ws = null;
		clearInterval(this.heartbeatInterval as NodeJS.Timeout);
		clearTimeout(this.heartbeatInterval as NodeJS.Timeout);
	}
}
module.exports = exports.default;