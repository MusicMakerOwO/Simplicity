enum Endpoints{
	GET_CLIENT = '/users/@me',
	GET_USER = '/users/{user_id}',
	EDIT_CLIENT = '/users/@me',
	GET_CLIENT_GUILDS = '/users/@me/guilds',
	CREATE_DM = '/users/@me/channels',
	CREATE_GROUP_DM = '/users/@me/channels'
}
export default Endpoints;
module.exports = exports.default;