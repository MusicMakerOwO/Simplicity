import fs from 'node:fs';
import Client from './Client';
import { APIEvents } from './APITypes/Enums';

export default class EventDispatcher {

	#client: Client;
	#events = new Map<string, { name: string, execute: (client: Client, data: unknown) => void }>();

	constructor(client: Client) {
		this.#client = client;
		this.loadEvents(`${__dirname}/Events`);
	}

	async loadEvents(directory: string, depth = 3) {
		if (depth === 0) return;

		const files = fs.readdirSync(directory, { withFileTypes: true });
		for (const file of files) {
			if (file.isDirectory()) {
				this.loadEvents(`${directory}/${file.name}`, depth - 1);
				continue;
			}
			
			if (!file.name.endsWith('.js')) continue; // after compilation

			const event = require(`${directory}/${file.name}`) as { name: string, execute: (client: Client, data: unknown) => void };
			if (typeof event.name !== 'string' || typeof event.execute !== 'function') throw new Error(`Invalid event file: ${file.name}`);
			this.#events.set(event.name, event);
		}
	}

	resolveEvent(event: string) : string | undefined {
		return APIEvents[event as keyof typeof APIEvents];
	}

	dispatch(event: string, data: unknown) {
		const eventName = this.resolveEvent(event);
		const eventHandler = this.#events.get(eventName as string);
		if (!eventHandler) return console.error(`Internal event not found: ${event}`);
		eventHandler.execute(this.#client, data);
	}
}
module.exports = exports.default;