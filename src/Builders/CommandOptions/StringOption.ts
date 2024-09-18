import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./BaseOption";

export default class StringOption extends BaseOption {

	public max_length: number = 6000;
	public min_length: number = 1;

	constructor() {
		super(CommandOptionTypes.STRING);
	}

	maxLength(max_length: number) {
		if (max_length < 1 || max_length > 6000) throw new Error('StringOption max_length must be between 1 and 6000');
		this.max_length = Number(max_length);
		return this;
	}

	minLength(min_length: number) {
		if (min_length < 0 || min_length > 6000) throw new Error('StringOption min_length must be between 0 and 6000');
		this.min_length = Number(min_length);
		return this;
	}

	override toJSON() {
		const maxLength = Math.max(this.max_length, this.min_length);
		const minLength = Math.min(this.max_length, this.min_length);
		return {
			...super.toJSON(),
			max_length: maxLength,
			min_length: minLength
		};
	}
}
module.exports = exports.default;