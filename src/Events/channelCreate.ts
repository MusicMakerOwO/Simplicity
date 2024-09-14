import Client from "../Client";
import { APIChannel } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Channel from "../Objects/Channel";

export default {
	name: APIEvents.CHANNEL_CREATE,
	execute: function(client: Client, data: APIChannel) {
		const channel = new Channel(client, data);
		client.emit('channelCreate', channel);
		client.channels.set(data.id, data);
	}
}
module.exports = exports.default;