const Endpoints: Record<string, string> = {
	GET_ROLES: '/guilds/{guild_id}/roles',
	GET_ROLE: '/guilds/{guild_id}/roles/{role_id}',
	CREATE_ROLE: '/guilds/{guild_id}/roles',
	EDIT_ROLE: '/guilds/{guild_id}/roles/{role_id}',
	DELETE_ROLE: '/guilds/{guild_id}/roles/{role_id}',
	EDIT_ROLE_POSITION: '/guilds/{guild_id}/roles'
};
export default Endpoints;
module.exports = exports.default;