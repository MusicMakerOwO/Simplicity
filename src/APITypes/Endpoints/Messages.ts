export default {
	GET_CHANNEL_MESSAGES: '/channels/{channel_id}/messages',
	SEND_MESSAGE: '/channels/{channel_id}/messages',
	GET_MESSAGE: '/channels/{channel_id}/messages/{message_id}',
	CREATE_MESSAGE: '/channels/{channel_id}/messages',
	CROSSPOST_MESSAGE: '/channels/{channel_id}/messages/{message_id}/crosspost',
	CREATE_REACTION: '/channels/{channel_id}/messages/{message_id}/reactions/{emoji}/@me',
	DELETE_OWN_REACTION: '/channels/{channel_id}/messages/{message_id}/reactions/{emoji}/@me',
	DELETE_USER_REACTION: '/channels/{channel_id}/messages/{message_id}/reactions/{emoji}/{user_id}',
	GET_REACTIONS: '/channels/{channel_id}/messages/{message_id}/reactions/{emoji}',
	DELETE_ALL_REACTIONS: '/channels/{channel_id}/messages/{message_id}/reactions',
	DELETE_ALL_REACTIONS_FOR_EMOJI: '/channels/{channel_id}/messages/{message_id}/reactions/{emoji}',
	EDIT_MESSAGE: '/channels/{channel_id}/messages/{message_id}',
	DELETE_MESSAGE: '/channels/{channel_id}/messages/{message_id}',
	BULK_DELETE_MESSAGES: '/channels/{channel_id}/messages/bulk-delete',
}
module.exports = exports.default;