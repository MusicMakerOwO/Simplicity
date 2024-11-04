import CommandOptionTypes from "../../Enums/CommandOptionTypes";
import BaseOption from "./Option";

export default class ChannelOption extends BaseOption {
    constructor() {
        super(CommandOptionTypes.CHANNEL)
    }

    setDefaultChannel(channelId: string) {
        return this;
    }

    override toJSON() {
        return {
            ...super.toJSON(),
        }
    }
}
module.exports = exports.default;