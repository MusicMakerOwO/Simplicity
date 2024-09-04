export default class BaseCommand {

	public type: number | null; // only used for subcommands + groups
	public name: string;
	public description: string;
	public options: Array<unknown>;

	constructor() {
		this.type = null;
		this.name = 'my-command';
		this.description = 'It does a thing, pretty cool right?';
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

	setName(name: string) {
		const nameRegex = /^[a-z0-9_-]+$/;
		if (!nameRegex.test(name)) throw new Error(`Command name must contain only letters, numbers, dashes, and underscores : ${name.replace(/[^a-z0-9_-]/g, '')}`);
		if (name.length < 2 || name.length > 32) throw new Error('Command name must be between 2 and 32 characters');

		this.name = name;
		return this;
	}

	setDescription(description: string) {
		if (description.length < 2 || description.length > 100) throw new Error('Command description must be between 2 and 100 characters');

		this.description = description;
		return this;
	}

	addOptions(...options: Array<unknown>) {
		if (this.options.length + options.length > 25) throw new Error('Commands can only have up to 25 options');
		this.options.push(...options);
		return this;
	}

	toJSON() {
		return {
			name: this.name,
			description: this.description,
			options: this.options
		};
	}
}
module.exports = exports.default;