import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import Message from "../Objects/Message";

export default {
	name: 'MESSAGE_CREATE',
	execute: function (client: Client, data: APIMessage) {
		const message = new Message(client, data);
		client.emit('messageCreate', message);
	}
}
module.exports = exports.default;