// const collector = interaction.createCollector(interaction);

import Interaction from './Interaction';
import Client from '../Client';
import EventEmitter from '../Events';

const TIME_TO_LIVE = 300_000; // 5 minutes

export default class Collector extends EventEmitter {
	#client: Client;
	// @ts-ignore
	#clearTimeout: NodeJS.Timeout;
	public readonly interaction: Interaction;
	public readonly messageID: string | null;

	constructor(client: Client, interaction: Interaction & { message: { id: string } }) {
		super();
		this.#client = client;
		this.interaction = interaction;
		this.messageID = interaction.message.id;

		this.#client.collectorLookup.set(`${interaction.channel_id}::${this.messageID}`, this);

		this.resetTimeout();
	}

	resetTimeout() {
		clearTimeout(this.#clearTimeout);
		this.#clearTimeout = setTimeout(() => {
			this.emit('end');
			this.destroy();
		}, TIME_TO_LIVE);
	}

	destroy() {
		clearTimeout(this.#clearTimeout);
		this.removeAllListeners();
		this.#client.collectorLookup.delete(`${this.interaction.channel_id}::${this.messageID}`);
	}

	handleInteraction(interaction: Interaction) {
		if (interaction.message?.id !== this.messageID) return;

		this.resetTimeout();

		const events = this.events.get('collect') as Function[];
		for (const event of events) {
			event(interaction);
		}
	}

	handleEnd() {
		this.emit('end');
		this.destroy();
	}
}
module.exports = exports.default;