import Client from '../Client';
import { APIGuild } from '../APITypes/Objects';
import { APIEvents } from '../APITypes/Enums';
import Guild from '../Objects/Guild';

export default {
	name: APIEvents.GUILD_CREATE,
	execute: function(client: Client, data: APIGuild) {
		client.guilds.set(data.id, data);

		for (const channel of data.channels) {
			client.channels.set(channel.id, channel);
		}

		for (const role of data.roles) {
			client.roles.set(role.id, role);
		}

		for (const emoji of data.emojis) {
			client.emojis.set(emoji.id, emoji);
		}

		for (const sticker of data.stickers ?? []) {
			client.stickers.set(sticker.id, sticker);
		}

		const guild = new Guild(client, data);
		client.emit('guildCreate', guild);
	}
}
module.exports = exports.default;