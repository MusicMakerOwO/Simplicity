import Client from "../Client";
import { APIChannel } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Channel from "../Objects/Channel";

export default {
	name: APIEvents.CHANNEL_DELETE,
	execute: function(client: Client, data: APIChannel) {
		const channel = new Channel(client, data);
		client.emit('channelDelete', channel);
		client.channels.delete(data.id);
	}
}
module.exports = exports.default;