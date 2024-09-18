import BaseCommand from "./BaseCommand";
import ApplyOptionMethods from "./ApplyOptionMethods";

class SubCommand extends BaseCommand {

	public override options : Array<Object & { type?: number, name: string, description: string }>;

	constructor() {
		super();
		this.type = 1;
		this.options = [];
	}

	override toJSON() {
		return {
			...super.toJSON(),
			type: this.type
		};
	}
}
ApplyOptionMethods.applyOptions(SubCommand);
export default SubCommand;
module.exports = exports.default;