import dgram from 'node:dgram';
import Events from './Events';

export default class UDP extends Events {
	#client: dgram.Socket;
	#port: number;
	#address: string;

	constructor(port: number, address: string) {
		super();

		this.#client = dgram.createSocket('udp4');
		this.#port = port;
		this.#address = address;

		this.#client.on('message', this.emit.bind(this, 'message'));

		this.#client.on('close', () => {
			this.emit('close');
		});

		this.#client.on('error', (err) => {
			this.emit('error', err);
			this.#client.close();
		});
	}

	send(data: string | Buffer) {
		const bufferData = typeof data === 'string' ? Buffer.from(data) : data;
		this.#client.send(bufferData, this.#port, this.#address, (err) => {
			if (err) {
				this.emit('error', err);
			} else {
				this.emit('send', data);
			}
		});
	}

	close() {
		this.#client.removeAllListeners();
		this.#client.close();
		// @ts-ignore
		this.#client = null; // free up the memory and let the GC do its job
	}
}
module.exports = exports.default;