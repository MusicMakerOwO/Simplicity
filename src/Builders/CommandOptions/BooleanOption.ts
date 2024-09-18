import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./BaseOption";

export default class BooleanOption extends BaseOption {
	constructor() {
		super(CommandOptionTypes.BOOLEAN)
	}

	override toJSON() {
		return {
			...super.toJSON(),
		}
	}
}
module.exports = exports.default;