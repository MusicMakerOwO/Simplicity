import Client from "../Client";
import { APIMessage } from "../APITypes/Objects";
import Message from "../Objects/Message";

export default {
	name: 'MESSAGE_UPDATE',
	execute: function (client: Client, data: APIMessage) {
		const newMessage = new Message(client, data);
		const oldMessage = client.messages.getSync(data.id);
		client.emit('messageUpdate', oldMessage, newMessage);

		client.messages.set(data.id, data);
	}
}