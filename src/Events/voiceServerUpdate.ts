import Client from "../Client";
import { APIEvents } from "../APITypes/Enums";

/*
{
  "t": "VOICE_SERVER_UPDATE",
  "s": 2,
  "op": 0,
  "d": {
    "token": "my_token",
    "guild_id": "41771983423143937",
    "endpoint": "smart.loyal.discord.gg"
  }
}
  */

export default {
	name: APIEvents.VOICE_SERVER_UPDATE,
	execute: async function(client: Client, data: any) {
		const player = client.vcClient.connections.get(data.guild_id);
		if (!player) return;

		await player.connect(data.endpoint, data.token);
	}
}
module.exports = exports.default;