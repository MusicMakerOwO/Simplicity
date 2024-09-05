const Endpoints: Record<string, string> = {
	GET_CLIENT_GUILDS: '/users/@me/guilds',
	GET_CLIENT_MEMBERS: '/users/@me/guilds/{guild_id}/member',
	LEAVE_GUILD: '/users/@me/guilds/{guild_id}',

	GET_GUILD: '/guilds/{guild_id}',
	GET_GUILD_PREVIEW: '/guilds/{guild_id}/preview',
	EDIT_GUILD: '/guilds/{guild_id}',
	DELETE_GUILD: '/guilds/{guild_id}',

	GET_CHANNELS: '/guilds/{guild_id}/channels',
	CREATE_CHANNEL: '/guilds/{guild_id}/channels',

	GET_MEMBER: '/guilds/{guild_id}/members/{user_id}',
	GET_MEMBERS: '/guilds/{guild_id}/members',
	SEARCH_MEMBERS: '/guilds/{guild_id}/members/search',

	GET_BANS: '/guilds/{guild_id}/bans',
	GET_BAN: '/guilds/{guild_id}/bans/{user_id}',
	CREATE_BAN: '/guilds/{guild_id}/bans/{user_id}',
	DELETE_BAN: '/guilds/{guild_id}/bans/{user_id}',
	BULK_BAN: '/guilds/{guild_id}/bulk-ban',

	// More needed
	// https://discord.com/developers/docs/resources/guild#get-guild
}
export default Endpoints;
module.exports = exports.default;