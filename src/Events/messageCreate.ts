import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Message from "../Objects/Message";

export default {
	name: APIEvents.MESSAGE_CREATE,
	execute: function (client: Client, data: APIMessage) {
		const message = new Message(client, data);
		client.emit('messageCreate', message);
		client.messages.set(data.id, data);
	}
}
module.exports = exports.default;