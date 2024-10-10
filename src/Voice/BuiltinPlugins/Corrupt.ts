export default class Corrupt {
	public bitrate: number;
	public bitdepth: number;
	public samples: number;

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

	// strength : 1 -> 10
	process(audio: Float32Array, strength = 12) {
		strength = Math.max(1, strength);

		// duplicate values {strengh} times, override previous values
		// AA BB CC DD EE FF -> AA AA CC CC EE EE

		let lastValue = 0x00;
		for (let i = 0; i < audio.length; i++) {
			if (i % strength === 0) {
				lastValue = audio[i];
			} else {
				audio[i] = lastValue;
			}
		}

		return audio;
	}
}
module.exports = exports.default;