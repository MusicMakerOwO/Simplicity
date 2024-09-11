import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";
import { OPCodes } from "./APITypes/Enums";
import Websocket from "./Websocket";
import Client from "./Client";
import EventDispatcher from "./EventDispatcher";
import HTTPS from 'node:https';

export default class WSClient {

	#token: string | null = null;
	#client: Client;
	public ws: Websocket | null;
	public seq: number | null;
	public heartbeat_interval: number;
	public jitter = Math.random() * 0.5 + 0.5;
	public internalEvents: EventDispatcher;
	public heartbeatInterval: NodeJS.Timeout | null = null;

	constructor(client: Client) {
		this.#client = client;
		this.ws = null;
		this.seq = null;
		this.heartbeat_interval = 0;
		this.internalEvents = new EventDispatcher(client);
	}
	
	#GenerateHeaders() {
		return {
			Authorization: `Bot ${this.#token}`,
			'Content-Type': 'application/json',
			'User-Agent': `DiscordBot (${this.#client.id}, 1.0) Node.js/${process.version}`
		};
	}

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
			if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
		}

		this.ws.on('open', () => this.#client.emit('events', 'Connected to Discord Gateway'));
		this.ws.on('close', () => this.#client.emit('events', 'Disconnected from Discord Gateway'));
		this.ws.on('error', (error: string) => this.#client.emit('events', `Error: `, error));
		this.ws.on('message', (data: unknown) => this.#client.emit('raw', `Received message: `, data));
		this.ws.on('send', (data: unknown) => this.#client.emit('raw', `Sent message: `, data));

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
				this.heartbeatInterval = setInterval(this.sendHeartbeat, this.heartbeat_interval * this.jitter);
				this.#client.connected_at = new Date();
			}

			if (data.op === OPCodes.HEARTBEAT) {
				this.seq = data.d;
				this.sendHeartbeat();
			}

			if (data.op === OPCodes.DISPATCH) {
				this.internalEvents.dispatch(data.t, data.d);
			}
		});
	}

	close() {
		this.#client.connected_at = null;
		this.ws?.close();
	}

	static METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

	SendRequest(method: string, resolvedEndpoint: string, options?: { body?: any, headers?: { [key: string]: any } }) : Promise<object> {
		if (!WSClient.METHODS.includes(method)) throw new Error(`Invalid method '${method}' - Must be one of ${WSClient.METHODS.join(', ')}`);
		const { body, headers: additionalHeaders = {} } = options ?? {};
		const BASE_HEADERS = this.#GenerateHeaders();
		return new Promise((resolve, reject) => {
			const req = HTTPS.request(resolvedEndpoint, {
				method: method,
				headers: {
					...BASE_HEADERS,
					...additionalHeaders
				},
			})
			req.on('error', reject);
			req.on('response', (res) => {
				const data: Array<string> = [];
				res.on('data', data.push.bind(data));
				res.on('end', () => {
					if (data.length === 0) return resolve({});
					const parsed = JSON.parse(data.join(''));
					resolve(parsed);
				});
			});
			if (body) req.write( JSON.stringify(body) );
			req.end();
		});
	}
}
module.exports = exports.default;