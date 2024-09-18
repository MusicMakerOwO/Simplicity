import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./BaseOption";

export default class AttachmentOption extends BaseOption {
    constructor() {
        super(CommandOptionTypes.ATTACHMENT);
    }

    override toJSON() {
        return {
            ...super.toJSON(),
        };
    }
}
module.exports = exports.default;