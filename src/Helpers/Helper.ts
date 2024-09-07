export default class HelperInterface extends Map<string, any> {
	public readonly guildID: string;
	constructor(guildID: string) {
		super();
		this.guildID = guildID;
	}

	public readonly cache: { set: (id: string, data: unknown) => void, get: (id: string) => unknown } = {
		set: super.set,
		get: super.get,
	}
	
	override set(id: string, data: any): this {
		throw new Error('Method not implemented.');
	}

	override get(id: string): Promise<any> {
		throw new Error('Method not implemented.');
	}

	async getAll(): Promise<any[]> {
		throw new Error('Method not implemented.');
	}

	async fetch(id?: string): Promise<any> {
		throw new Error('Method not implemented.');
	}
}
module.exports = exports.default;