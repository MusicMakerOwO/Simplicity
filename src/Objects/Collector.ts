// const collector = interaction.createCollector(interaction);

import Interaction from './Interaction';
import Client from '../Client';
import EventEmitter from '../Events';

const TIME_TO_LIVE = 300_000; // 5 minutes

export default class Collector extends EventEmitter {
	#client: Client;
	#clearTimeout: NodeJS.Timeout | null = null;
	public readonly channelID: string;
	public readonly messageID: string | null;

	constructor(client: Client, channelID: string, messageID: string) {
		super();
		this.#client = client;
		this.channelID = channelID;
		this.messageID = messageID;

		this.#client.collectorLookup.set(`${channelID}::${messageID}`, this);

		this.resetTimeout();
	}

	resetTimeout() {
		if (this.#clearTimeout) clearTimeout(this.#clearTimeout);
		this.#clearTimeout = setTimeout(() => {
			this.emit('end');
			this.destroy();
		}, TIME_TO_LIVE);
	}

	destroy() {
		if (this.#clearTimeout) clearTimeout(this.#clearTimeout);
		this.removeAllListeners();
		this.#client.collectorLookup.delete(`${this.channelID}::${this.messageID}`);
	}

	handleInteraction(interaction: Interaction) {
		if (interaction.message?.id !== this.messageID) return;

		this.resetTimeout();

		const events = this.events.get('collect') ?? [];
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