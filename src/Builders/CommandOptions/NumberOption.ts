import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./BaseOption";

export default class NumberOption extends BaseOption {

	public max_value: number = Number.MAX_SAFE_INTEGER;
	public min_value: number = Number.MIN_SAFE_INTEGER;

	constructor() {
		super(CommandOptionTypes.NUMBER)
	}

	setMaxValue(max_value: number) {
		if (max_value < Number.MIN_SAFE_INTEGER || max_value > Number.MAX_SAFE_INTEGER) throw new Error('NumberOption max_value must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER');
		this.max_value = Number(max_value);
		return this;
	}

	setMinValue(min_value: number) {
		if (min_value < Number.MIN_SAFE_INTEGER || min_value > Number.MAX_SAFE_INTEGER) throw new Error('NumberOption min_value must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER');
		this.min_value = Number(min_value);
		return this;
	}

	override toJSON() {
		return {
			...super.toJSON(),
		}
	}
}
module.exports = exports.default;