import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Message from "../Objects/Message";

export default {
	name: APIEvents.MESSAGE_UPDATE,
	execute: function (client: Client, data: APIMessage) {
		const newMessage = new Message(client, data);
		const oldMessage = client.messages.getSync(data.id);
		client.emit('messageUpdate', oldMessage, newMessage);

		client.messages.set(data.id, data);
	}
}
module.exports = exports.default;