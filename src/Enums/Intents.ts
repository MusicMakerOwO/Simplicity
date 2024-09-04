// GUILDS (1 << 0)
//   - GUILD_CREATE
//   - GUILD_UPDATE
//   - GUILD_DELETE
//   - GUILD_ROLE_CREATE
//   - GUILD_ROLE_UPDATE
//   - GUILD_ROLE_DELETE
//   - CHANNEL_CREATE
//   - CHANNEL_UPDATE
//   - CHANNEL_DELETE
//   - CHANNEL_PINS_UPDATE
//   - THREAD_CREATE
//   - THREAD_UPDATE
//   - THREAD_DELETE
//   - THREAD_LIST_SYNC
//   - THREAD_MEMBER_UPDATE
//   - THREAD_MEMBERS_UPDATE *
//   - STAGE_INSTANCE_CREATE
//   - STAGE_INSTANCE_UPDATE
//   - STAGE_INSTANCE_DELETE

// GUILD_MEMBERS (1 << 1) **
//   - GUILD_MEMBER_ADD
//   - GUILD_MEMBER_UPDATE
//   - GUILD_MEMBER_REMOVE
//   - THREAD_MEMBERS_UPDATE *

// GUILD_MODERATION (1 << 2)
//   - GUILD_AUDIT_LOG_ENTRY_CREATE
//   - GUILD_BAN_ADD
//   - GUILD_BAN_REMOVE

// GUILD_EMOJIS_AND_STICKERS (1 << 3)
//   - GUILD_EMOJIS_UPDATE
//   - GUILD_STICKERS_UPDATE

// GUILD_INTEGRATIONS (1 << 4)
//   - GUILD_INTEGRATIONS_UPDATE
//   - INTEGRATION_CREATE
//   - INTEGRATION_UPDATE
//   - INTEGRATION_DELETE

// GUILD_WEBHOOKS (1 << 5)
//   - WEBHOOKS_UPDATE

// GUILD_INVITES (1 << 6)
//   - INVITE_CREATE
//   - INVITE_DELETE

// GUILD_VOICE_STATES (1 << 7)
//   - VOICE_CHANNEL_EFFECT_SEND
//   - VOICE_STATE_UPDATE

// GUILD_PRESENCES (1 << 8) **
//   - PRESENCE_UPDATE

// GUILD_MESSAGES (1 << 9)
//   - MESSAGE_CREATE
//   - MESSAGE_UPDATE
//   - MESSAGE_DELETE
//   - MESSAGE_DELETE_BULK

// GUILD_MESSAGE_REACTIONS (1 << 10)
//   - MESSAGE_REACTION_ADD
//   - MESSAGE_REACTION_REMOVE
//   - MESSAGE_REACTION_REMOVE_ALL
//   - MESSAGE_REACTION_REMOVE_EMOJI

// GUILD_MESSAGE_TYPING (1 << 11)
//   - TYPING_START

// DIRECT_MESSAGES (1 << 12)
//   - MESSAGE_CREATE
//   - MESSAGE_UPDATE
//   - MESSAGE_DELETE
//   - CHANNEL_PINS_UPDATE

// DIRECT_MESSAGE_REACTIONS (1 << 13)
//   - MESSAGE_REACTION_ADD
//   - MESSAGE_REACTION_REMOVE
//   - MESSAGE_REACTION_REMOVE_ALL
//   - MESSAGE_REACTION_REMOVE_EMOJI

// DIRECT_MESSAGE_TYPING (1 << 14)
//   - TYPING_START

// MESSAGE_CONTENT (1 << 15) ***

// GUILD_SCHEDULED_EVENTS (1 << 16)
//   - GUILD_SCHEDULED_EVENT_CREATE
//   - GUILD_SCHEDULED_EVENT_UPDATE
//   - GUILD_SCHEDULED_EVENT_DELETE
//   - GUILD_SCHEDULED_EVENT_USER_ADD
//   - GUILD_SCHEDULED_EVENT_USER_REMOVE

// AUTO_MODERATION_CONFIGURATION (1 << 20)
//   - AUTO_MODERATION_RULE_CREATE
//   - AUTO_MODERATION_RULE_UPDATE
//   - AUTO_MODERATION_RULE_DELETE

// AUTO_MODERATION_EXECUTION (1 << 21)
//   - AUTO_MODERATION_ACTION_EXECUTION

// GUILD_MESSAGE_POLLS (1 << 24)
//   - MESSAGE_POLL_VOTE_ADD
//   - MESSAGE_POLL_VOTE_REMOVE

// DIRECT_MESSAGE_POLLS (1 << 25)
//   - MESSAGE_POLL_VOTE_ADD
//   - MESSAGE_POLL_VOTE_REMOVE

// Have to use a Record<string, bigint> because TypeScript doesn't support BigInt enums >:(
const Intents: Record<string, bigint> = {
	guilds: 1n << 0n,
	guildMembers: 1n << 1n,
	guildModeration: 1n << 2n,
	guildEmojisAndStickers: 1n << 3n,
	guildIntegrations: 1n << 4n,
	guildWebhooks: 1n << 5n,
	guildInvites: 1n << 6n,
	guildVoiceStates: 1n << 7n,
	guildPresences: 1n << 8n,
	guildMessages: 1n << 9n,
	guildMessageReactions: 1n << 10n,
	guildMessageTyping: 1n << 11n,
	directMessages: 1n << 12n,
	directMessageReactions: 1n << 13n,
	directMessageTyping: 1n << 14n,
	messageContent: 1n << 15n,
	guildScheduledEvents: 1n << 16n,
	autoModerationConfiguration: 1n << 20n,
	autoModerationExecution: 1n << 21n,
	guildMessagePolls: 1n << 24n,
	directMessagePolls: 1n << 25n
}

export default Intents;

module.exports = exports.default;