import { ReadyEvent } from '../APITypes/Payloads.js';
import Client from '../Client.js';

export default {
	name: 'READY',
	execute: function(client: Client, data: ReadyEvent) {
		client.user = data.user;

		for (const guild of data.guilds as any[]) {
			client.guilds.set(guild.id, guild);
		}

		client.emit('ready', data);
	}
}
module.exports = exports.default;