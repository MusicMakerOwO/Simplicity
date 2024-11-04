import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./Option";

export default class IntegerOption extends BaseOption {
    public max_value: number = Number.MAX_SAFE_INTEGER;
    public min_value: number = Number.MIN_SAFE_INTEGER;

    constructor() {
        super(CommandOptionTypes.INTEGER);
    }

    setMaxValue(max: number): this {
        this.max_value = max;
        return this
    }
    
    setMinValue(min: number): this {
        this.min_value = min;
        return this;
    }


    override toJSON() {
        return {
            ...super.toJSON(),
            min_value: this.min_value,
            max_value: this.max_value,
        };
    }
}

module.exports = exports.default;