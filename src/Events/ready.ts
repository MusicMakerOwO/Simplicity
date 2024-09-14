import { ReadyEvent } from '../APITypes/Payloads';
import Client from '../Client';
import { APIEvents } from '../APITypes/Enums';
import User from '../Objects/User';
import Debounce from '../Utils/Debounce';

export default {
	name: APIEvents.READY,
	execute: async function(client: Client, data: ReadyEvent) {
		client.user = new User(client, data.user);

		// Wait for the guilds to stop coming in before emitting ready
		// This is to wait for all the guilds and a dynamic solution
		client.on('guildCreate', Debounce(() => {
			client.emit('ready', client);
		}, 50));
	}
}
module.exports = exports.default;