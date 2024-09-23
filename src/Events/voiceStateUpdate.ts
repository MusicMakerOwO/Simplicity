import Client from "../Client";
import { APIEvents } from "../APITypes/Enums";
import { APIVoiceStateUpdate } from "../APITypes/Objects";

// emitted when a user joins/leaves/moves voice channels
export default {
	name: APIEvents.VOICE_STATE_UPDATE,
	execute: async function(client: Client, data: APIVoiceStateUpdate) {
		if (!data.guild_id) return;
		if (data.user_id !== client.user?.id) {
			client.emit(APIEvents.VOICE_STATE_UPDATE, data);
			return;
		}

		const player = client.vcClient.connections.get(data.guild_id);
		if (!player) return;

		player.sessionID = data.session_id;
	}
}
module.exports = exports.default;