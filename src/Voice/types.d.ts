export interface VoicePlugin {
	constructor(): void;
	init(bitrate: number, bitdepth: number, samples: number): void;
	process(audio: Float32Array, options?: unknown): Promise<Float32Array>;
}

export interface VoicePluginConstructor {
	new (): VoicePlugin;
}

export type UDP_Packet = {
	op: number;
	data: any;
};