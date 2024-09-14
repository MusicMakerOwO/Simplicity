import Client from '../Client';
import { APIGuild } from '../APITypes/Objects';
import Guild from '../Objects/Guild';

export default {
	name: 'GUILD_DELETE',
	execute: function(client: Client, data: APIGuild) {
		const guild = new Guild(client, data);
		client.emit('guildDelete', guild);
		client.guilds.delete(data.id);
	}	
}