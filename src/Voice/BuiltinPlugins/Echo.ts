export default class Echo {
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

	process(audio: Float32Array, delaySeconds = 0.5, decay = 0.8) {
		decay = 1 - decay;
		const delay = Math.round(delaySeconds * this.bitrate);

		const output = new Float32Array(audio.length);
		output.set(audio);

		for (let i = 0; i < audio.length; i++) {
			const echo = i - delay;
			output[i] += audio[echo] * decay;
			output[i] += audio[i] * decay;
		}
		return output;
	}
}
module.exports = exports.default;