import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./Option";

export default class Mentionable extends BaseOption {
    constructor() {
        super(CommandOptionTypes.MENTIONABLE)
    }

    override toJSON() {
        return {
            ...super.toJSON()
        }
    }
}
module.exports = exports.default;