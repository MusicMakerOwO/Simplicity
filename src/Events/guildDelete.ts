import Client from '../Client';
import { APIGuild } from '../APITypes/Objects';
import { APIEvents } from '../APITypes/Enums';
import Guild from '../Objects/Guild';

export default {
	name: APIEvents.GUILD_DELETE,
	execute: function(client: Client, data: APIGuild) {
		const guild = new Guild(client, data);
		client.emit('guildDelete', guild);
		client.guilds.delete(data.id);
	}	
}
module.exports = exports.default;