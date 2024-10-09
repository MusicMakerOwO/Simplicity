export interface VoicePlugin {
	init(bitrate: number, bitdepth: number, samples: number): void;
	process(audio: Float32Array, options?: unknown): Float32Array | Promise<Float32Array>
}

export interface VoicePluginConstructor {
	new (): VoicePlugin;
}

export type UDP_Packet = {
	op: number;
	data: any;
};