import Intents from "../Enums/Intents";
import ClosestMatch from "./ClosestMatch";

export default function ResolveIntents(intents: number | bigint | string[]): number {
	if (typeof intents === 'number') return intents;
	if (typeof intents === 'bigint') return Number(intents); // may lose precision, not my problem lol

	// MESSAGE_CREATE -> messageCreate
	function NormalizeEventName(event: string) : string {
		if (!/^[A-Z_]+$/.test(event)) return event;
		return String(event).toLowerCase().replace(/_([a-z])/g, (_, x) => x.toUpperCase());
	}

	let result = 0;
	for (const intent of intents) {
		const intentName = NormalizeEventName(intent);
		if (intentName in Intents) {
			result |= Intents[intentName as keyof typeof Intents];
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