import Client from "./Client";
import VCPlayer from "./Voice/Player";
import VoicePluginManager from "./Voice/PluginManager";

export default class VCClient extends VoicePluginManager {
	#client: Client;
	public connections: Map<string, VCPlayer>;

	constructor(client: Client) {
		super();
		this.connections = new Map();
		this.#client = client;
	}

	async addConnection(guildID: string, channelID: string) {
		const shardID = this.#client.wsClient.RandomShardID();
		const player = new VCPlayer(this.#client, shardID, guildID, channelID);
		player.joinChannel();
		this.connections.set(guildID, player);
		return player;
	}

	async removeConnection(guildID: string) {
		const player = this.connections.get(guildID);
		if (!player) return;
		await player.disconnect();
		this.connections.delete(guildID);
	}

	getConnection(guildID: string) {
		return this.connections.get(guildID);
	}

	destroy() {
		this.#client.wsClient.WSSendBulk({
			op: 4,
			d: {
				guild_id: null,
				channel_id: null,
				self_mute: false,
				self_deaf: false
			}
		});
		for (const player of this.connections.values()) {
			player.disconnect();
			player.destroy();
		}
	}
}
module.exports = exports.default;