enum Endpoint {
	GET_INVITE = '/invites/{invite_code}',
	DELETE_INVITE = '/invites/{invite_code}',
	GET_GUILD_INVITES = '/guilds/{guild_id}/invites'
}
export default Endpoint;