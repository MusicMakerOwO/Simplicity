// /guilds/{guild_id}/bans/{user_id} -> https://discord.com/api/v10/guilds/123/bans/456
const BASE_ENDPOINT = 'https://discord.com/api/v10';
const INSERTS_REGEX = /{([^}]+)}/g;
export default function ResolveEndpoint(endpoint: string, objects: { [key: string]: Object }) {
	if (typeof endpoint !== 'string') throw new Error(`Invalid endpoint - Must be a string, received ${typeof endpoint}`);
	
	const inserts = endpoint.match(INSERTS_REGEX);
	if (!inserts) return endpoint.startsWith('http') ? endpoint : `${BASE_ENDPOINT}${endpoint}`;
	
	// guild_id -> object.guild.id
	for (const insert of inserts) {
		const objectLookups = insert.slice(1, -1).split('_');
		let value: any = objects;
		for (const key of objectLookups) {
			if (!(key in value)) throw new Error(`Key '${key}' not found in '${insert}'`);
			value = value[key];
		}
		endpoint = endpoint.replace(insert, value);
	}
	// return `${BASE_ENDPOINT}${endpoint}`;
	return endpoint.startsWith('http') ? endpoint : `${BASE_ENDPOINT}${endpoint}`;
}
module.exports = exports.default;