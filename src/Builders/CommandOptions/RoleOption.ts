import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./BaseOption";

export default class RoleOption extends BaseOption {
    constructor() {
        super(CommandOptionTypes.ROLE)
    }

    override toJSON() {
        return {
            ...super.toJSON(),
        }
    }
}
module.exports = exports.default;