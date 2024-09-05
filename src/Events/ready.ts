import { ReadyEvent } from '../APITypes/Payloads.js';
import Client from '../Client.js';
import User from '../Objects/User.js';

export default {
	name: 'READY',
	execute: async function(client: Client, data: ReadyEvent) {
		client.user = new User(data.user);

		// Guilds are emmitted seperately in GUILD_CREATE
		// https://discord.com/developers/docs/topics/gateway-events#ready

		// for (const guild of data.guilds as any[]) {
		// 	client.guilds.set(guild.id, guild);
		// }

		// allow time for the guilds to come in
		await new Promise(r => setTimeout(r, 100));

		client.emit('ready', data);
	}
}
module.exports = exports.default;