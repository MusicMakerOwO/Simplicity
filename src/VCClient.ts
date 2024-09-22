import Client from "./Client";
import VCPlayer from "./VCPlayer";

export default class VCClient {
	#client: Client;
	public connections: Map<string, VCPlayer> = new Map();
	public pendingConnections: Map<string, string> = new Map();

	constructor(client: Client) {
		this.#client = client;
		this.#client;
	}

	async addConnection(guildID: string, channelID: string) {
		const shardID = this.#client.wsClient.RandomShardID();
		const player = new VCPlayer(this.#client, shardID, guildID, channelID);
		this.connections.set(guildID, player);
		return player;
	}

	async removeConnection(guildID: string) {
		const player = this.connections.get(guildID);
		if (!player) return;
		await player.disconnect();
		this.connections.delete(guildID);
	}
}
module.exports = exports.default;