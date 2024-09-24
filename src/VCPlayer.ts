import Client from "./Client";
import Websocket from "./Websocket";
import UDP from "./UDP";
import { GatewayOPCodes, VoiceOPCodes } from "./APITypes/Enums";
import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";

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
	if (initialValue === 0x00 || initialValue === 0x01) {
		// IP discovery packet
		const response = data.readUIntBE(0, 2) === 0x00 ? 'request' : 'response';
		const length = data.readUIntBE(2, 2);
		const ssrc = data.readUIntBE(4, 4); // 32-bit integer unisgned
		const ip = data.toString('utf8', 8, 8 + length).split('\0')[0]; // null terminated string
		const port = data.readUIntBE(8 + length, 2);
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

	constructor(client: Client, shardID: number, guildID: string, channelID: string) {
		this.#client = client;
		this.#guildID = guildID;
		this.#channelID = channelID;
		this.shardID = shardID;
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
		this.#ws = new Websocket(`wss://${endpoint}/?v=4`);

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
		this.destroy();
	}

	async destroy() {
		this.#udp?.close();
		this.#ws?.close();
		this.#udp = null;
		this.#ws = null;
		clearInterval(this.heartbeatInterval as NodeJS.Timeout);
	}
}
module.exports = exports.default;