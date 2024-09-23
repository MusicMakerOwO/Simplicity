import { GatewayPayload, HelloEvent } from "./APITypes/GatewayTypes";
import { GatewayOPCodes } from "./APITypes/Enums";
import Websocket from "./Websocket";
import Client from "./Client";
import EventDispatcher from "./EventDispatcher";
import HTTPS from 'node:https';

declare type SessionStats = {
	shards: number;
	session_start_limit: {
		total: number;
		remaining: number;
		reset_after: number;
		max_concurrency: number;
	};
};

export default class WSClient {

	#token: string | null = null;
	#client: Client;
	public heartbeat_interval: number;
	public jitter = Math.random() * 0.5 + 0.5; // 0.5 -> 1.0
	public internalEvents: EventDispatcher;
	public heartbeatInterval: NodeJS.Timeout | null = null;
	public shards: Array<Websocket> = [];
	public shard_seq: Array<number> = [];
	
	constructor(client: Client) {
		this.#client = client;
		this.heartbeat_interval = 0;
		this.internalEvents = new EventDispatcher(client);

		process.on('SIGINT', this.close.bind(this));
	}
	
	#GenerateHeaders() {
		return {
			Authorization: `Bot ${this.#token}`,
			'Content-Type': 'application/json',
			'User-Agent': `DiscordBot (${this.#client.id}, 1.0) Node.js/${process.version}`
		};
	}

	sendHeartbeat(shardID: number) {
		this.shards[shardID].send({
			op: GatewayOPCodes.HEARTBEAT,
			d: this.shard_seq[shardID] ?? null
		});
		this.#client.emit('events', `Sent heartbeat to shard ${shardID + 1}`);
	}

	async getRecommendedShards() : Promise<SessionStats> {
		return await this.SendRequest('GET', 'https://discord.com/api/v10/gateway/bot') as SessionStats;
	}

	async connect(token?: string) {
		if (token) this.#token = token;
		this.#client.emit('events', 'Connecting to Discord Gateway');
		this.#client.emit('events', 'Fetching recommended shards');

		const shardData = await this.getRecommendedShards();
		this.#client.emit('events', `Recommended shard count: ${shardData.shards}`);
		this.#client.emit('events', `Session start limit: ${shardData.session_start_limit.remaining}/${shardData.session_start_limit.total} - Reset after ${shardData.session_start_limit.reset_after}ms`);
		this.#client.emit('events', `Max concurrency: ${shardData.session_start_limit.max_concurrency}`);
		this.#client.emit('events', `Starting ${shardData.shards} shards`);

		for (let i = 0; i < shardData.shards; i++) {
			this.#client.emit('events', `Connecting to shard ${i + 1}`);
			this.WSConnect(i, shardData.shards);
		}
	}

	WSSend(shardID: number, payload: Object) {
		this.shards[shardID].send(payload);
	}

	WSSendBulk(payload: Object) {
		for (let i = 0; i < this.shards.length; i++) {
			this.WSSend(i, payload);
		}
	}

	RandomShardID() {
		return Math.floor(Math.random() * this.shards.length);
	}

	async WaitForPayload(shardID: number, opCode: GatewayOPCodes) : Promise<GatewayPayload> {
		const ws = this.shards[shardID];
		if (!ws) throw new Error(`Shard ${shardID} is not connected`);

		return new Promise((resolve, reject) => {
			const handler = (data: GatewayPayload) => {
				if (data.op === opCode) {
					ws.off('message', handler);
					resolve(data);
				}
			};
			ws.on('message', handler);
		});
	}

	WSConnect(shardID: number = 0, shard_count: number = 1) {
		const ws = new Websocket('wss://gateway.discord.gg/?v=9&encoding=json');
		this.shards[shardID] = ws;

		const CloseWS = (error?: string) => {
			if (error) console.error(error);
			ws.close();
			if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
		}

		ws.on('open', () => this.#client.emit('events', 'Connected to Discord Gateway'));
		ws.on('close', () => this.#client.emit('events', 'Disconnected from Discord Gateway'));
		ws.on('error', (error: string) => this.#client.emit('events', `Error: `, error));
		ws.on('message', (data: unknown) => this.#client.emit('raw', `Received message: `, data));
		ws.on('send', (data: unknown) => this.#client.emit('raw', `Sent message: `, data));

		ws.on('close', CloseWS);
		ws.on('error', CloseWS);

		ws.on('message', (data: HelloEvent | GatewayPayload) => {
			this.#client.emit('events', `Received ${GatewayOPCodes[data.op]} event`);

			if (data.op === GatewayOPCodes.HELLO) {
				data = data as HelloEvent;
				ws.send({
					op: GatewayOPCodes.IDENTIFY,
					d: {
						max_dave_protocol_version: 1,
						token: `Bot ${this.#token}`,
						intents: Number(this.#client.intents),
						properties: {
							os: process.platform,
							device: 'Simplicity'
						},
						shard: [shardID, shard_count],
					}
				})
				this.heartbeat_interval = data.d.heartbeat_interval;
				this.sendHeartbeat(shardID);
				this.heartbeatInterval = setInterval(this.sendHeartbeat.bind(this, shardID), this.heartbeat_interval * this.jitter);
				this.#client.connected_at = new Date();
			}

			data = data as GatewayPayload;

			if (data.op === GatewayOPCodes.HEARTBEAT) {
				this.shard_seq[shardID] = data.d;
				this.sendHeartbeat(shardID);
			}

			if (data.op === GatewayOPCodes.DISPATCH) {
				this.internalEvents.dispatch(data.t, data.d);
			}
		});
	}

	close() {
		console.log('Closing all shards');
		this.#client.connected_at = null;
		this.#client.emit('events', 'Closing all shards');
		for (const shard of Object.values(this.shards)) {
			shard.close();
		}
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