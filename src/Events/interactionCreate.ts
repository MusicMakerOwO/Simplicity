import Client from '../Client';
import { APIInteraction } from '../APITypes/Objects';
import { APIEvents } from '../APITypes/Enums';
import Interaction from '../Objects/Interaction';

export default {
	name: APIEvents.INTERACTION_CREATE,
	execute: function (client: Client, data: APIInteraction) {
		const interaction = new Interaction(client, data);

		const activeCollector = client.collectorLookup.get(`${interaction.channel_id}-${interaction.message?.id}`);
		if (activeCollector) {
			activeCollector.handleInteraction(interaction);
		} else {
			client.emit('interactionCreate', interaction);
		}
	}
}
module.exports = exports.default;