import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import Message from "../Objects/Message";

export default {
	name: 'MESSAGE_DELETE',
	execute: function (client: Client, data: APIMessage) {
		const message = new Message(client, data);
		client.emit('messageDelete', message);
		client.messages.delete(data.id);
	}
}