import Client from '../Client';
import { APIGuild } from '../APITypes/Objects';
import { APIEvents } from '../APITypes/Enums';
import Guild from '../Objects/Guild';

function addGuildID<T extends Object>(obj: T, guildID: string) : T & { guild_id: string } {
	return Object.assign(obj, { guild_id: guildID });
}

export default {
	name: APIEvents.GUILD_CREATE,
	execute: function(client: Client, data: APIGuild) {
		client.guilds.set(data.id, data);

		for (const channel of data.channels) {
			client.channels.set(`${data.id}-${channel.id}`, addGuildID(channel, data.id));
		}

		for (const role of data.roles) {
			client.roles.set(`${data.id}-${role.id}`, addGuildID(role, data.id));
		}

		for (const emoji of data.emojis) {
			client.emojis.set(`${data.id}-${emoji.id}`, addGuildID(emoji, data.id));
		}

		for (const sticker of data.stickers ?? []) {
			client.stickers.set(`${data.id}-${sticker.id}`, addGuildID(sticker, data.id));
		}

		const guild = new Guild(client, data);
		client.emit('guildCreate', guild);
	}
}
module.exports = exports.default;