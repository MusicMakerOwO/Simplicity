// new WSClient(url: string, options: object)

import Events from './Events';
import { WSEvents } from './Enums/Events';

export default class WSClient extends Events {
	private ws: WebSocket;

	constructor(url: string, options: object) {
		super();
		this.ws = new WebSocket(url);
		this.ws.onopen = this.emit.bind(null, WSEvents.OPEN);
		this.ws.onclose = this.emit.bind(null, WSEvents.CLOSE);
		this.ws.onerror = this.emit.bind(null, WSEvents.ERROR);
		this.ws.onmessage = this.emit.bind(null, WSEvents.MESSAGE);
	}

	send(data: string) : void {
		this.ws.send(data);
	}

	close() : void {
		this.ws.close();
	}

	static connect(url: string, options: object) : WSClient {
		return new WSClient(url, options);
	}

	static connectSecure(url: string, options: object) : WSClient {
		return new WSClient(url.replace('ws:', 'wss:'), options);
	}
}