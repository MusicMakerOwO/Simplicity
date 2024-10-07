import type { VoicePlugin, VoicePluginConstructor } from './types';

export default class PluginManager {
	#plugins: Map<string, VoicePlugin> = new Map();

	loadPlugin(name: string, plugin: VoicePluginConstructor) {
		if (this.#plugins.has(name)) {
			throw new Error(`A plugin with the name "${name}" already exists - Please pick a unique name`);
		}
		const data = new plugin();
		this.#plugins.set(name, data);
	}

	async processAudio(name: string, audio: Float32Array, options: unknown) {
		const plugin = this.#plugins.get(name);
		if (!plugin) throw new Error(`Plugin "${name}" not found`);
		return await plugin.process(audio, options);
	}

	initPlugin(name: string, bitrate: number, bitdepth: number, samples: number) {
		const plugin = this.#plugins.get(name);
		if (!plugin) throw new Error(`Plugin "${name}" not found`);
		plugin.init(bitrate, bitdepth, samples);
	}

	removePlugin(name: string) {
		this.#plugins.delete(name);
	}
}
module.exports = exports.default;