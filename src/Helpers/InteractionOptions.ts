import Client from "../Client";
import { APIInteractionOption, APIResolvedData } from "../APITypes/Objects";
import CommandOptionTypes from "../Enums/CommandOptionTypes";

export default class InteractionOptions {
	#client: Client;
	#guildID: string;

	// <type::name, value>
	public hoistedOptions: { [key: string]: string | number | boolean | null };

	constructor(client: Client, guildID: string, options: Array<APIInteractionOption>, resolved: APIResolvedData) {
		this.#client = client;
		this.#guildID = guildID;

		for (const user of Object.values(resolved.users ?? {})) {
			client.users.set(user.id, user);
		}

		for (const [id, member] of Object.entries(resolved.members ?? {})) {
			client.members.set(`${guildID}::${id}`, member);
		}

		for (const channel of Object.values(resolved.channels ?? {})) {
			this.#client.channels.set(channel.id, channel);
		}

		for (const role of Object.values(resolved.roles ?? {})) {
			this.#client.roles.set(`${guildID}::${role.id}`, role);
		}

		this.hoistedOptions = {};
		
		this.#parseOptions(options);
	}

	#parseOptions(options: Array<APIInteractionOption>) {
		for (const option of options) {
			if ('value' in option) {
				this.hoistedOptions[`${option.type}::${option.name}`] = option.value ?? null;
			} else {
				this.hoistedOptions[option.type] = option.name;
			}

			if (Array.isArray(option.options)) {
				this.#parseOptions(option.options);
			}
		}
	}

	getOption<T>(type: number, name?: string) : T | null {
		const key = [type, name].filter(Boolean).join('::');
		return (this.hoistedOptions[key] as T) ?? null;
	}

	subcommandGroup() {
		return this.getOption(CommandOptionTypes.SUB_COMMAND_GROUP);
	}

	subcommand() {
		return this.getOption(CommandOptionTypes.SUB_COMMAND);
	}

	getUser(name: string) {
		const userID = this.getOption<string>(CommandOptionTypes.USER, name);
		if (!userID) return null;
		return this.#client.users.getSync(userID);
	}

	getMember(name: string) {
		const memberID = this.getOption<string>(CommandOptionTypes.USER, name);
		if (!memberID) return null;
		return this.#client.members.getSync(`${this.#guildID}::${memberID}`);
	}

	getChannel(name: string) {
		const channelID = this.getOption<string>(CommandOptionTypes.CHANNEL, name);
		if (!channelID) return null;
		return this.#client.channels.getSync(channelID);
	}

	getRole(name: string) {
		const roleID = this.getOption<string>(CommandOptionTypes.ROLE, name);
		if (!roleID) return null;
		return this.#client.roles.getSync(`${this.#guildID}::${roleID}`);
	}

	getString(name: string) {
		return this.getOption(CommandOptionTypes.STRING, name);
	}

	getInteger(name: string) {
		return this.getOption(CommandOptionTypes.INTEGER, name);
	}

	getBoolean(name: string) {
		return this.getOption(CommandOptionTypes.BOOLEAN, name);
	}

	getNumber(name: string) {
		return this.getOption(CommandOptionTypes.NUMBER, name);
	}

	getMentionable(name: string) {
		return this.getOption(CommandOptionTypes.MENTIONABLE, name);
	}
}
module.exports = exports.default;