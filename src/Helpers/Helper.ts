export default class HelperInterface {
	public readonly guildID: string;
	constructor(guildID: string) {
		this.guildID = guildID;
	}

	set(id: string, data: any): this {
		throw new Error('Method not implemented.');
	}

	async get(id: string): Promise<any> {
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