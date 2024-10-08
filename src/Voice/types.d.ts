export interface VoicePlugin {
	constructor(): void;
	init(bitrate: number, bitdepth: number, samples: number): void;
	process(audio: Float32Array, options?: unknown): Promise<Float32Array>;
}

export interface VoicePluginConstructor {
	new (): VoicePlugin;
}

export type UDP_Packet = {
	type: 0x01 | 0x02;
	op: number;
	length: number;
	ssrc: number;
	data: Buffer;
};