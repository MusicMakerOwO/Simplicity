import Intents from "../Enums/Intents";
import ClosestMatch from "./ClosestMatch";

export default function ResolveIntents(intents: number | bigint | string[]): bigint {
	if (typeof intents === 'number') return BigInt(intents);
	if (typeof intents === 'bigint') return intents;

	// MESSAGE_CREATE -> messageCreate
	function NormalizeEventName(event: string) : string {
		if (!/^[A-Z_]+$/.test(event)) return event;
		return String(event).toLowerCase().replace(/_([a-z])/g, (_, x) => x.toUpperCase());
	}

	let result = 0n;
	for (const intent of intents) {
		const intentName = NormalizeEventName(intent);
		if (intentName in Intents) {
			result |= Intents[intentName];
		} else {
			const closestMatch = ClosestMatch(intentName, Object.keys(Intents));
			throw new Error(`Invalid intent "${intent}", did you mean "${closestMatch}"?`);
		}
	}

	// I really don't know why you would leave this out
	// Includes users, guilds, channels, and roles 
	result |= Intents.guilds;

	return result;
}
module.exports = exports.default;