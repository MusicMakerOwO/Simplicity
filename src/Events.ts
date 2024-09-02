// custom event emitter

export default class Events {
	private events: Map<string, Function[]>;

	constructor() {
		this.events = new Map<string, Function[]>();
	}

	static NormalizeEventName(event: string) : string {
		// MESSAGE_CREATE -> messageCreate
		return String(event).toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
	}

	// can access interally or externally, making it easy for both users and developers
	NormalizeEventName(event: string) : string {
		return Events.NormalizeEventName(event);
	}

	on(event: string, listener: Function) : number {
		const normalizedEvent = this.NormalizeEventName(event);
		const listeners = this.events.get(normalizedEvent) ?? [];
		listeners.push(listener);
		this.events.set(normalizedEvent, listeners);
		return listeners.length;
	}

	off(event: string, listener: Function|number) : boolean {
		const normalizedEvent = this.NormalizeEventName(event);
		const listeners = this.events.get(normalizedEvent);
		if (!listeners) return false;
		if (typeof listener === 'number') {
			listeners.splice(listener, 1);
			return true;
		}
		for (let i = 0; i < listeners.length; i++) {
			// By default function comparison is done by reference so even a JSON equivalent function will not be equal
			// We need to compare the string representation of the function, or rather the raw text
			const funcString = Function.prototype.toString.call(listeners[i]);
			if (funcString === Function.prototype.toString.call(listener)) {
				listeners.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	emit(event: string, ...args: unknown[]) : void {
		const normalizedEvent = this.NormalizeEventName(event);
		const listeners = this.events.get(normalizedEvent);
		if (!listeners) return;
		for (const listener of listeners) {
			listener(...args);
		}
	}

	#ConvertToOnce(event: string, listener: Function) : Function {
		const onceListener = (...args: unknown[]) => {
			this.off(event, onceListener);
			listener(...args);
		};
		return onceListener;
	}

	once(event: string, listener: Function) : void {
		const normalizedEvent = this.NormalizeEventName(event);
		this.on(normalizedEvent, this.#ConvertToOnce(normalizedEvent, listener));
	}

	clear() : void {
		this.events.clear();
	}

	// For debugging purposes
	getEvents() : Map<string, Function[]> {
		return this.events;
	}

	getListeners(event: string) : Function[] {
		const normalizedEvent = this.NormalizeEventName(event);
		return this.events.get(normalizedEvent) ?? [];
	}

	getListenerIndex(event: string, listener: Function) : number {
		const normalizedEvent = this.NormalizeEventName(event);
		const listeners = this.events.get(normalizedEvent);
		if (!listeners) return -1;
		const funcString = Function.prototype.toString.call(listener);
		for (let i = 0; i < listeners.length; i++) {
			if (funcString === Function.prototype.toString.call(listeners[i])) {
				return i;
			}
		}
		return -1;
	}

}