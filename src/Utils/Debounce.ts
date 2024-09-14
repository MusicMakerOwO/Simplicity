export default function debounce(func: Function, wait_ms: number) {
	let timeout: NodeJS.Timeout | null;
	return function (...args: any[]) {
		const later = () => {
			timeout = null;
			func(...args);
		};
		clearTimeout(timeout as NodeJS.Timeout);
		timeout = setTimeout(later, wait_ms);
	};
}
module.exports = exports.default;