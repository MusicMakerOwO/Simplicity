export default class BaseCommand {

	public type: number | null; // only used for subcommands + groups
	public _name: string;
	public _description: string;
	public options: Array<unknown>;

	constructor() {
		this.type = null;
		this._name = 'my-command';
		this._description = 'It does a thing, pretty cool right?';
		this.options = [];
	}

	static isValid(command: any) : boolean {
		if (command instanceof BaseCommand) return true;

		if (!command || typeof command !== 'object') return false;
		if (typeof command.name !== 'string') return false;
		if (typeof command.description !== 'string') return false;
		if (!Array.isArray(command.options)) return false;

		return true;
	}

	name(name: string) {
		const nameRegex = /^[a-z0-9_-]+$/;
		if (!nameRegex.test(name)) throw new Error(`Command name must contain only letters, numbers, dashes, and underscores : ${name.replace(/[^a-z0-9_-]/g, '')}`);
		if (name.length < 2 || name.length > 32) throw new Error('Command name must be between 2 and 32 characters');

		this._name = name;
		return this;
	}

	description(description: string) {
		if (description.length < 2 || description.length > 100) throw new Error('Command description must be between 2 and 100 characters');

		this._description = description;
		return this;
	}

	toJSON() {
		return {
			name: this._name,
			description: this._description,
			options: this.options
		};
	}
}
module.exports = exports.default;