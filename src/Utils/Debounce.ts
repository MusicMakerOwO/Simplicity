export default function debounce(func: Function, wait_ms: number) {
	let timeout: NodeJS.Timeout;
	return function(...args: any[]) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(...args);
		}, wait_ms);
	};
}
module.exports = exports.default;