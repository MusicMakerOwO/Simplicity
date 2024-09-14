import Client from '../Client';
import { APIInteraction } from '../APITypes/Objects';
import { APIEvents } from '../APITypes/Enums';
import Interaction from '../Objects/Interaction';

export default {
	name: APIEvents.INTERACTION_CREATE,
	execute: function (client: Client, data: APIInteraction) {
		const interaction = new Interaction(client, data);
		console.log('Emitting interactionCreate');
		client.emit('interactionCreate', interaction);
	}
}
module.exports = exports.default;