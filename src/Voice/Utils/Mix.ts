export default function Mix(primary: Float32Array, secondary: Float32Array, mix = 0.5) {
	// mix two audio arrays
	for (let i = 0; i < primary.length; i++) {
		primary[i] = primary[i] * (1 - mix) + secondary[i] * mix;
	}
	return primary;
}
module.exports = exports.default;