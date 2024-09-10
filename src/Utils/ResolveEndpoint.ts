// /guilds/{guild_id}/bans/{user_id} -> https://discord.com/api/v10/guilds/123/bans/456
const BASE_ENDPOINT = 'https://discord.com/api/v10';
const INSERTS_REGEX = /{([^}]+)}/g;
export default function ResolveEndpoint(endpoint: string, objects: { [key: string]: Object }) {
	const inserts = endpoint.match(INSERTS_REGEX);
	if (!inserts) return `${BASE_ENDPOINT}${endpoint}`;
	
	// guild_id -> object.guild.id
	for (const insert of inserts) {
		const objectLookups = insert.slice(1, -1).split('_');
		let value: any = objects;
		for (const key of objectLookups) {
			if (!(key in value)) throw new Error(`Key '${key}' not found in '${objectLookups[0]}' object`);
			value = value[key];
		}
		endpoint = endpoint.replace(insert, value);
	}
	return `${BASE_ENDPOINT}${endpoint}`;
}
module.exports = exports.default;