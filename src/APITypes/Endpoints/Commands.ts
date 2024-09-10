const Endpoints: Record<string, string> = {
	GLOBAL_GET_COMMANDS: '/applications/{client_id}/commands',
	GLOBAL_GET_COMMAND: '/applications/{client_id}/commands/{command_id}',
	GLOBAL_CREATE_COMMAND: '/applications/{client_id}/commands',
	GLOBAL_MODIFY_COMMAND: '/applications/{client_id}/commands/{command_id}',
	GLOBAL_DELETE_COMMAND: '/applications/{client_id}/commands/{command_id}',
	GLOBAL_BULK_OVERWRITE_COMMANDS: '/applications/{client_id}/commands',
	GLOBAL_GET_COMMAND_PERMISSIONS: '/applications/{client_id}/commands/{command_id}/permissions',
	GLOBAL_MODIFY_COMMAND_PERMISSIONS: '/applications/{client_id}/commands/{command_id}/permissions',

	GUILD_GET_COMMANDS: '/applications/{client_id}/guilds/{guild_id}/commands',
	GUILD_GET_COMMAND: '/applications/{client_id}/guilds/{guild_id}/commands/{command_id}',
	GUILD_CREATE_COMMAND: '/applications/{client_id}/guilds/{guild_id}/commands',
	GUILD_MODIFY_COMMAND: '/applications/{client_id}/guilds/{guild_id}/commands/{command_id}',
	GUILD_DELETE_COMMAND: '/applications/{client_id}/guilds/{guild_id}/commands/{command_id}',
	GUILD_BULK_OVERWRITE_COMMANDS: '/applications/{client_id}/guilds/{guild_id}/commands',
	GUILD_GET_COMMAND_PERMISSIONS: '/applications/{client_id}/guilds/{guild_id}/commands/{command_id}/permissions',
}
export default Endpoints;
module.exports = exports.default;