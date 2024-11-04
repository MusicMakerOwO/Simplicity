// Why does discord have so many gaps in their flags???
// https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
export default {
	PINNED: 1 << 1,
	REQUIRE_TAG: 1 << 4,
	HIDE_MEDIA_DOWNLOAD_OPTION: 1 << 15,
}
module.exports = exports.default;