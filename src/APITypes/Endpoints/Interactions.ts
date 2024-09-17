export default{
	CREATE_RESPONSE: '/interactions/{interaction_id}/{interaction_token}/callback',
	GET_RESPONSE: '/webhooks/{client_id}/{interaction_token}/messages/@original',
	EDIT_RESPONSE: '/webhooks/{client_id}/{interaction_token}/messages/@original',
	DELETE_RESPONSE: '/webhooks/{client_id}/{interaction_token}/messages/@original',
	CREATE_FOLLOWUP: '/webhooks/{client_id}/{interaction_token}',
	EDIT_FOLLOWUP: '/webhooks/{client_id}/{interaction_token}/messages/{message_id}',
	DELETE_FOLLOWUP: '/webhooks/{client_id}/{interaction_token}/messages/{message_id}'
}
module.exports = exports.default;