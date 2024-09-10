const Endpoints: Record<string, string> = {
	LIST_EMOJIS: '/guilds/{guild_id}/emojis',
	GET_EMOJI: '/guilds/{guild_id}/emojis/{emoji_id}',
	CREATE_EMOJI: '/guilds/{guild_id}/emojis',
	MODIFY_EMOJI: '/guilds/{guild_id}/emojis/{emoji_id}',
	DELETE_EMOJI: '/guilds/{guild_id}/emojis/{emoji_id}',

	LIST_BOT_EMOJIS: '/applications/{client_id}/emojis',
	GET_BOT_EMOJI: '/applications/{client_id}/emojis/{emoji_id}',
	CREATE_BOT_EMOJI: '/applications/{client_id}/emojis',
	MODIFY_BOT_EMOJI: '/applications/{client_id}/emojis/{emoji_id}',
	DELETE_BOT_EMOJI: '/applications/{client_id}/emojis/{emoji_id}',
}
export default Endpoints;
module.exports = exports.default;