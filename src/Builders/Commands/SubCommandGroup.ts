import BaseCommand from "./Command";
import SubCommand from "./SubCommand";
import ApplyOptionMethods from "./ApplyOptionMethods";

class SubCommandGroup extends BaseCommand {

	public override options: Array<SubCommand>;

	constructor() {
		super();
		this.type = 2;
		this.options = [];
	}

	subCommand(fn: (subcommand: SubCommand) => void) {
		// @ts-ignore
		return this.addOption(SubCommand, fn);
	}

	subCommandGroup() {
		throw new Error('Cannot nest subcommand groups, use a subcommand instead');
	}

	override toJSON() {
		return {
			...super.toJSON(),
			type: this.type,
			subcommands: this.options.map((c: BaseCommand) => typeof c.toJSON === 'function' ? c.toJSON() : c)
		};
	}
}
ApplyOptionMethods.applyOptions(SubCommandGroup, ['addOption']);
export default SubCommandGroup;
module.exports = exports.default;