import BaseCommand from "./BaseCommand";
import SubCommand from "./SubCommand";

export default class SubCommandGroup extends BaseCommand {
	private subcommands: Array<SubCommand>;

	constructor() {
		super();
		this.type = 2;
		this.subcommands = [];
	}

	addSubCommand(...subcommands: Array<SubCommand>) {
		if (this.subcommands.length + subcommands.length > 25) throw new Error('Commands can only have up to 25 subcommands');
		for (const subcommand of subcommands) {
			if (subcommand.type !== 1) throw new Error('Subcommand Groups may only contain subcommands');
			if (this.subcommands.some(c => c.name === subcommand.name)) throw new Error(`Subcommand with name ${subcommand.name} already exists`);
		}
		this.subcommands.push(...subcommands);
		return
	}

	override addOptions(...options: Array<unknown>): this {
		throw new Error('Subcommand Groups cannot have options, use addSubCommand() instead');
	}

	override toJSON() {
		return {
			...super.toJSON(),
			type: this.type,
			subcommands: this.subcommands.map((c: BaseCommand) => c.toJSON())
		};
	}
}