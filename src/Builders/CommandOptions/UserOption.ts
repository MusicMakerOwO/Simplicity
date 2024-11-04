import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./Option";

export default class UserOption extends BaseOption {
    constructor() {
        super(CommandOptionTypes.USER)
    }

    override toJSON() {
        return {
            ...super.toJSON(),
        }
    }
}
module.exports = exports.default;