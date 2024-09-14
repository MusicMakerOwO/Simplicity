import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Message from "../Objects/Message";

export default {
	name: APIEvents.MESSAGE_DELETE,
	execute: function (client: Client, data: APIMessage) {
		const message = new Message(client, data);
		client.emit('messageDelete', message);
		client.messages.delete(data.id);
	}
}
module.exports = exports.default;