import Client from "./Client";
import Websocket from "./Websocket";
import { OPCodes } from "./APITypes/Enums";

export default class VCPlayer {
	#client: Client;
	#ws: Websocket | null = null;
	#guildID: string;
	#channelID: string;

	public shardID: number = 0;
	public ssrc: number = 0;
	public ip: string = '';
	public port: number = 0;
	public modes: string[] = [];

	constructor(client: Client, shardID: number, guildID: string, channelID: string) {
		this.#client = client;
		this.#guildID = guildID;
		this.#channelID = channelID;
		this.shardID = shardID;
	}

	joinChannel() {
		this.#client.wsClient.WSSend(this.shardID, {
			op: OPCodes.VOICE_STATE_UPDATE,
			d: {
				guild_id: this.#guildID,
				channel_id: this.#channelID,
				self_mute: false,
				self_deaf: false
			}
		});
	}

	async connect(endpoint: string, token: string) {
		// todo: https://discord.com/developers/docs/topics/voice-connections#connecting-to-voice
	}

	async disconnect() {
		this.#ws?.close();
		this.#client.wsClient?.WSSend(this.shardID, {
			op: OPCodes.VOICE_STATE_UPDATE,
			d: {
				guild_id: this.#guildID,
				channel_id: null,
				self_mute: false,
				self_deaf: false
			}
		});
	}
}
module.exports = exports.default;