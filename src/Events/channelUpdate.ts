import Client from "../Client";
import { APIChannel } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Channel from "../Objects/Channel";

export default {
	name: APIEvents.CHANNEL_UPDATE,
	execute: function(client: Client, data: APIChannel) {
		const oldChannel = client.channels.getSync(data.id);
		const newChannel = new Channel(client, data);
		client.emit('channelUpdate', oldChannel, newChannel);
		client.channels.set(data.id, data);
	}
}
module.exports = exports.default;