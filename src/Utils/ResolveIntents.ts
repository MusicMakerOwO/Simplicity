import Intents from "../Enums/Intents";
import ClosestMatch from "./ClosestMatch";

export default function ResolveIntents(intents: number | bigint | string[]): bigint {
	if (typeof intents === 'number') return BigInt(intents);
	if (typeof intents === 'bigint') return intents;

	// MESSAGE_CREATE -> messageCreate
	function NormalizeEventName(event: string) : string {
		return String(event).toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
	}

	let result = BigInt(0);
	for (const intent of intents) {
		const intentName = NormalizeEventName(intent);
		const intentValue = Intents[intentName];
		if (!intentValue) {
			const closestMatch = ClosestMatch(intentName, Object.keys(Intents));
			throw new Error(`Invalid intent "${intent}", did you mean "${closestMatch}"?`);
		}
		result |= BigInt(intentValue);
	}

	// I really don't know why you would leave this out
	// Includes users, guilds, channels, and roles 
	result |= Intents.guilds;

	return result;
}
module.exports = exports.default;