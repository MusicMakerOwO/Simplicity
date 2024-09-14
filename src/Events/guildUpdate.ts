import Client from "../Client";
import { APIGuild } from "../APITypes/Objects";
import Guild from "../Objects/Guild";

export default {
	name: 'GUILD_UPDATE',
	execute: function(client: Client, data: APIGuild) {
		const newGuild = new Guild(client, data);
		const oldGuild = client.guilds.getSync(data.id);
		client.emit('guildUpdate', oldGuild, newGuild);
		client.guilds.set(data.id, data);
	}	
}