const Endpoints: Record<string, string> = {
	GET_STICKER_PACK: '/sticker-packs/{sticker_pack_id}',
	GET_STICKERS: '/guilds/{guild_id}/stickers',
	CREATE_STICKER: '/guilds/{guild_id}/stickers',
	EIDT_STICKER: '/guilds/{guild_id}/stickers/{sticker_id}',
	DELETE_STICKER: '/guilds/{guild_id}/stickers/{sticker_id}'
}
export default Endpoints;