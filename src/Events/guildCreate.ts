import Client from '../Client.js';

export default {
	name: 'GUILD_CREATE',
	execute: function(client: Client, data: any) {
		client.guilds.set(data.id, data);
	}	
}
module.exports = exports.default;