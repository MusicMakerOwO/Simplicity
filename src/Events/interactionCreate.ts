import Client from '../Client';
import Interaction from '../Objects/Interaction';
import { APIInteraction } from '../APITypes/Objects';

export default {
	name: 'INTERACTION_CREATE',
	execute: function (client: Client, data: APIInteraction) {
		const interaction = new Interaction(client, data);
		console.log('Emitting interactionCreate');
		client.emit('interactionCreate', interaction);
	}
}
module.exports = exports.default;