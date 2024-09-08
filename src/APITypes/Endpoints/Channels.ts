const Endpoints: Record<string, string> = {
	GET_CHANNEL: '/channels/{channel_id}',
	DELETE_CHANNEL: '/channels/{channel_id}',
	MODIFY_CHANNEL_PERMISSIONS: '/channels/{channel_id}/permissions/{overwrite_id}',
	GET_CHANNEL_INVITES: '/channels/{channel_id}/invites',
	CREATE_CHANNEL_INVITE: '/channels/{channel_id}/invites',
	DELETE_CHANNEL_PERMISSION: '/channels/{channel_id}/permissions/{overwrite_id}',
	FOLLOW_ANNOUNCEMENT_CHANNEL: '/channels/{channel_id}/followers',
	TRIGGER_TYPING_INDICATOR: '/channels/{channel_id}/typing',
	GET_PINS: '/channels/{channel_id}/pins',
	ADD_PIN: '/channels/{channel_id}/pins/{message_id}',
	REMOVE_PIN: '/channels/{channel_id}/pins/{message_id}',

	START_THREAD_FROM_MESSAGE: '/channels/{channel_id}/messages/{message_id}/threads',
	CREATE_THREAD: '/channels/{channel_id}/threads',
	CREATE_FORUM_THREAD: '/channels/{channel_id}/threads',
	JOIN_THREAD: '/channels/{channel_id}/thread-members/@me',
	ADD_THREAD_MEMBER: '/channels/{channel_id}/thread-members/{user_id}',
	LEAVE_THREAD: '/channels/{channel_id}/thread-members/@me',
	REMOVE_THREAD_MEMBER: '/channels/{channel_id}/thread-members/{user_id}',
	GET_THREAD_MEMBER: '/channels/{channel_id}/thread-members/{user_id}',
	LIST_THREAD_MEMBERS: '/channels/{channel_id}/thread-members',
	LIST_ARCHIVED_THREADS_PUBLIC: '/channels/{channel_id}/threads/archived/public',
	LIST_ARCHIVED_THREADS_PRIVATE: '/channels/{channel_id}/threads/archived/private',
	LIST_JOINED_PRIVATE_ARCHIVED_THREADS: '/channels/{channel_id}/users/@me/threads/archived/private'
};
export default Endpoints;
module.exports = exports.default;