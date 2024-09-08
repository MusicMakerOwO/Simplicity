// Why does discord have so many gaps in their flags???
// https://discord.com/developers/docs/resources/channel#channel-object-channel-flags
const ChannelFlags: Record<string, bigint> = {
	PINNED: 1n << 1n,
	REQUIRE_TAG: 1n << 4n,
	HIDE_MEDIA_DOWNLOAD_OPTION: 1n << 15n,
}
export default ChannelFlags;
module.exports = exports.default;