export default function Noise(length: number) {
	// generate white noise
	const audio = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		audio[i] = Math.random()
	}
	return audio;
}
module.exports = exports.default;