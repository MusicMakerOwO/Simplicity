import BaseCommand from "./BaseCommand";

export default class SubCommand extends BaseCommand {

	public override options : Array<Object & { type?: number, name: string, description: string }>;

	constructor() {
		super();
		this.type = 1;
		this.options = [];
	}

	override addOptions(...options: Array<Object>): this {
		if (this.options.length + options.length > 25) throw new Error('Commands can only have up to 25 options');
		for (const option of options as any[]) {
			if ('type' in option) throw new Error('Subcommands may only contain options');
			if (this.options.some(c => c.name === option.name)) throw new Error(`Option with name ${option.name} already exists`);
		}
		this.options.push(...options as any[]);
		return this;
	}

	override toJSON() {
		return {
			...super.toJSON(),
			type: this.type
		};
	}
}
module.exports = exports.default;