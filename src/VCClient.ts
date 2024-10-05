import Client from "./Client";
import VCPlayer from "./VCPlayer";

// Interface for plugins to modify audio data before transmission
interface VoicePlugin {
	init(bitrate: number, bitdepth: number, samples: number): void; // Initialize the plugin and pass in audio settings
	process(audio: Float32Array, options: unknown): Float32Array; // Perform whatever operatoins on the audio data
	destroy?(): void; // Cleanup
}

export default class VCClient {
	#client: Client;
	public connections: Map<string, VCPlayer> = new Map();
	public plugins: Map<string, VoicePlugin> = new Map();

	constructor(client: Client) {
		this.#client = client;
	}

	addPlugin(name: string, plugin: VoicePlugin) {
		if (this.plugins.has(name)) {
			throw new Error(`A plugin with the name "${name}" already exists - Please pick a unique name`);
		}
		this.plugins.set(name, plugin);
	}

	removePlugin(name: string) {
		const plugin = this.plugins.get(name);
		if (!plugin) return;
		if (typeof plugin.destroy === 'function') try {
			plugin.destroy();
		} catch (e) {
			console.error(`Failed to destroy plugin "${name}"`, e);
		}
		this.plugins.delete(name);
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