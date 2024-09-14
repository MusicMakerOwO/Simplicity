import Client from "../Client";
import { APIChannel } from "../APITypes/Objects";
import Channel from "../Objects/Channel";

export default {
	name: 'CHANNEL_DELETE',
	execute: function(client: Client, data: APIChannel) {
		const channel = new Channel(client, data);
		client.emit('channelDelete', channel);
		client.channels.delete(data.id);
	}
}