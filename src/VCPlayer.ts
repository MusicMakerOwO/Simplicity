import Client from "./Client";
import Websocket from "./Websocket";
import UDP from "./UDP";
import { GatewayOPCodes, VoiceOPCodes } from "./APITypes/Enums";
import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";

const IP_REGEX = /\d+\.\d+\.\d+\.\d+/;

const IP_DISCOVERY_PACKET = Buffer.alloc(74);
IP_DISCOVERY_PACKET.writeUInt8(0x00, 0);
IP_DISCOVERY_PACKET.writeUInt8(0x01, 1);
IP_DISCOVERY_PACKET.writeUInt8(0x00, 2);
IP_DISCOVERY_PACKET.writeUInt8(70, 3);
for (let i = IP_DISCOVERY_PACKET.length; i < 74; i++) {
	IP_DISCOVERY_PACKET.writeUInt8(0);
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

				this.#udp = new UDP(this.port, this.ip);

				this.#udp.send(IP_DISCOVERY_PACKET);
				this.#udp.once('message', (packet: Buffer) => {
					this.#localIP = (packet.toString().match(IP_REGEX) as RegExpMatchArray)[0];
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
				});
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