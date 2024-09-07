import { APIEmoji, APIUser } from "../APITypes/Objects";

export default class Emoji {
	public readonly id: string;
	public readonly name: string;
	public readonly roles: string[];
	public readonly user: APIUser | null;
	public readonly require_colons: boolean;
	public readonly managed: boolean;
	public readonly animated: boolean;
	public readonly available: boolean;

	constructor(data: APIEmoji) {
		this.id = data.id;
		this.name = data.name;
		this.roles = data.roles ?? [];
		this.user = data.user ?? null;
		this.require_colons = Boolean(data.require_colons);
		this.managed = Boolean(data.managed);
		this.animated = Boolean(data.animated);
		this.available = Boolean(data.available ?? true);
	}

	getURL({ size = 256, dynamic = true }: { size?: number, dynamic?: boolean } = {}): string {
		if (this.animated && dynamic) return `https://cdn.discordapp.com/emojis/${this.id}.gif?size=${size}`;
		return `https://cdn.discordapp.com/emojis/${this.id}.png?size=${size}`;
	}

	toString(): string {
		return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
	}

	static fromString(emoji: string): Emoji {
		const match = emoji.match(/<(?:(a):)?(\w+):(\d+)>/);
		if (!match) throw new Error('Invalid emoji');
		return new Emoji({
			id: match.pop() as string,
			name: match.pop() as string,
			animated: Boolean(match.pop()),
			available: true
		});
	}
}