import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";
import { OPCodes } from "./APITypes/Enums";
import Websocket from "./Websocket";
import Client from "./Client";
import EventDispatcher from "./EventDispatcher";


export default class WSClient {

	#token: string | null;
	#client: Client;
	public ws: Websocket | null;
	public seq: number | null;
	public heartbeat_interval: number;
	public connected_at: Date | null;
	public jitter = Math.random() * 0.5 + 0.5;
	public eventDispatcher: EventDispatcher;

	constructor(client: Client, token = null, options = {}) {
		this.#token = token;
		this.#client = client;
		this.ws = null;
		this.seq = null;
		this.heartbeat_interval = 0;
		this.connected_at = null;
		this.eventDispatcher = new EventDispatcher(client);
	}

	// #GenerateHeaders() {
	// 	return {
	// 		Authorization: `Bot ${this.#token}`,
	// 		'User-Agent': `DiscordBot (${this.#client.id}, 1.0) Node.js/${process.version}`
	// 	};
	// }

	sendHeartbeat() {
		this.ws?.send({
			op: OPCodes.HEARTBEAT,
			d: this.seq
		});
	}

	connect(token?: string) {
		if (token) this.#token = token;
		if (!this.#token) throw new Error('No token provided');

		this.ws = new Websocket('wss://gateway.discord.gg/?v=9&encoding=json');

		const CloseWS = (error?: string) => {
			if (error) console.error(error);
			this.ws?.close();
		}

		this.ws.on('open', () => this.#client.emit('events', 'Connected to Discord Gateway'));
		this.ws.on('close', () => this.#client.emit('events', 'Disconnected from Discord Gateway'));
		this.ws.on('error', (error: string) => this.#client.emit('events', `Error: `, error));
		this.ws.on('message', (data: unknown) => this.#client.emit('events', `Received message: `, data));
		this.ws.on('send', (data: unknown) => this.#client.emit('events', `Sent message: `, data));

		this.ws.on('close', CloseWS);
		this.ws.on('error', CloseWS);

		this.ws.on('message', (data: HelloEvent | GatewayPayload) => {
			this.#client.emit('events', `Received ${OPCodes[data.op]} event`);

			if (data.op === OPCodes.HELLO) {
				this.ws?.send({
					op: OPCodes.IDENTIFY,
					d: {
						token: `Bot ${this.#token}`,
						intents: Number(this.#client.intents),
						properties: {
							os: process.platform,
							device: 'Simplicity'
						}
					}
				})
				this.heartbeat_interval = data.d.heartbeat_interval;
				this.sendHeartbeat();
				setInterval(this.sendHeartbeat, this.heartbeat_interval * this.jitter);
				this.connected_at = new Date();
			}

			if (data.op === OPCodes.HEARTBEAT) {
				this.seq = data.d;
				this.sendHeartbeat();
			}

			if (data.op === OPCodes.DISPATCH) {
				this.eventDispatcher.dispatch(data.t, data.d);
			}
		});
	}
}
module.exports = exports.default;