export default class Quantize {
	
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

	// Effectively we round the values a bit and create a bunch of jadged edges
	// This adds a lot of noise to the audio but done right it is perfect for lofi music
	// 
	//    /\    /\            _|_       _|_
	//   /  \  /  \   ->    _|   |_   _|   |_
	//  /    \/	   \      _|       |_|       |_
	//
	process(audio: Float32Array, bits = 4) {
		for (let i = 0; i < audio.length; i++) {
			audio[i] = Math.round(audio[i] * (2 ** bits)) / (2 ** bits);
		}
		return audio;
	}
}