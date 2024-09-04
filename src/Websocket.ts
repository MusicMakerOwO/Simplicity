import Events from './Events';
import { WSEvents } from './Enums/Events';

export default class WSClient extends Events {
	private ws: WebSocket;

	#WSCallback(event: string) : (data: (CloseEvent | MessageEvent | Event) & { data?: string }) => void {
		return (data) => {
			const isJSON = this.#isJSON(data.data);
			if (isJSON) {
				const parsed = JSON.parse(data.data);
				this.emit(event, parsed);
				return;
			} else if (data.data) {
				this.emit(event, data.data);
				return;
			} else {
				this.emit(event);
			}
		};
	}

	#isJSON(data: string) : boolean {
		try {
			JSON.parse(data);
			return true;
		} catch {
			return false;
		}
	}

	constructor(url: string) {
		super();
		this.ws = new WebSocket(url);
		this.ws.onopen = this.#WSCallback(WSEvents.OPEN);
		this.ws.onclose = this.#WSCallback(WSEvents.CLOSE);
		this.ws.onerror = this.#WSCallback(WSEvents.ERROR);
		this.ws.onmessage = this.#WSCallback(WSEvents.MESSAGE);
	}

	send(data: any) : void {
		this.emit('send', data);
		this.ws.send(JSON.stringify(data));
	}

	close() : void {
		this.ws.close();
	}

	static connect(url: string) : WSClient {
		return new WSClient(url);
	}

	static connectSecure(url: string) : WSClient {
		return new WSClient(url.replace('ws:', 'wss:'));
	}

	get state() : number {
		return this.ws.readyState;
	}

	get url() : string {
		return this.ws.url;
	}

	get protocol() : string {
		return this.ws.protocol;
	}

	get isOpen() : boolean {
		return this.ws.readyState === WebSocket.OPEN;
	}
}
module.exports = exports.default;