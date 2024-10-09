export default class Distortion {
	bitrate: number;
	bitdepth: number;
	samples: number;

	constructor() {
		this.bitrate = 0;
		this.bitdepth = 0;
		this.samples = 0;
	}

	init(bitrate: number, bitdepth: number, samples: number) {
		this.bitrate = bitrate;
		this.bitdepth = bitdepth;
		this.samples = samples;
	}
	
	process(audio: Float32Array, amount = 1.5) {
		amount *= 10;
		// multiply every sample, cap it, divide it
		for (let i = 0; i < audio.length; i++) {
			audio[i] = Math.min(1, Math.max(-1, audio[i] * amount)) / amount;
		}
		return audio;
	}
}