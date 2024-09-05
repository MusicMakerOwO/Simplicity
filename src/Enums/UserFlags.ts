const UserFlags : Record<string, bigint> = {
	STAFF: 1n << 0n,
	PARTNER: 1n << 1n,
	HYPESQUAD: 1n << 2n,
	BUG_HUNTER_LEVEL_1: 1n << 3n,
	HYPESQUAD_BRAVERY: 1n << 6n,
	HYPESQUAD_BRILLIANCE: 1n << 7n,
	HYPESQUAD_BALANCE: 1n << 8n,
	PREMIUM_EARLY_SUPPORTER: 1n << 9n,
	TEAM_PSEUDO_USER: 1n << 10n,
	BUG_HUNTER_LEVEL_2: 1n << 14n,
	VERIFIED_BOT: 1n << 16n,
	VERIFIED_DEVELOPER: 1n << 17n,
	CERTIFIED_MODERATOR: 1n << 18n,
	BOT_HTTP_INTERACTIONS: 1n << 19n,
	ACTIVE_DEVELOPER: 1n << 22n
}
export default UserFlags;
module.exports = exports.default;