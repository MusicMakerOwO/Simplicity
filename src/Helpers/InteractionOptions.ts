import Client from "../Client";
import { APIInteractionOption, APIResolvedData } from "../APITypes/Objects";
import CommandOptionTypes from "../Enums/CommandOptionTypes";

import User from "../Objects/User";
import Member from "../Objects/Member";
import Channel from "../Objects/Channel";
import Role from "../Objects/Role";

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

	getOption(type: number, name?: string) {
		const key = [type, name].filter(Boolean).join('::');
		return this.hoistedOptions[key] ?? null;
	}

	subcommandGroup() {
		return this.getOption(CommandOptionTypes.SUB_COMMAND_GROUP);
	}

	subcommand() {
		return this.getOption(CommandOptionTypes.SUB_COMMAND);
	}

	getUser(name: string) : User | null {
		const userID = this.getOption(CommandOptionTypes.USER, name) as string;
		if (!userID) return null;
		return this.#client.users.getSync(userID) ?? null;
	}

	getMember(name: string) : Member | null {
		const memberID = this.getOption(CommandOptionTypes.USER, name) as string;
		if (!memberID) return null;
		return this.#client.members.getSync(`${this.#guildID}::${memberID}`) ?? null;
	}

	getChannel(name: string) : Channel | null {
		const channelID = this.getOption(CommandOptionTypes.CHANNEL, name) as string;
		if (!channelID) return null;
		return this.#client.channels.getSync(channelID) ?? null;
	}

	getRole(name: string) : Role | null {
		const roleID = this.getOption(CommandOptionTypes.ROLE, name) as string;
		if (!roleID) return null;
		return this.#client.roles.getSync(`${this.#guildID}::${roleID}`) ?? null;
	}

	getString(name: string) : string | null {
		return this.getOption(CommandOptionTypes.STRING, name) as string;
	}

	getInteger(name: string) : number | null {
		return this.getOption(CommandOptionTypes.INTEGER, name) as number;
	}

	getBoolean(name: string) : boolean | null {
		return this.getOption(CommandOptionTypes.BOOLEAN, name) as boolean;
	}

	getNumber(name: string) : number | null {
		return this.getOption(CommandOptionTypes.NUMBER, name) as number;
	}

	getMentionable(name: string) : User | Role | null {
		const ID = this.getOption(CommandOptionTypes.MENTIONABLE, name) as string;
		if (!ID) return null;
		if (this.#client.users.cache.has(ID)) return this.#client.users.getSync(ID) as User;
		if (this.#client.roles.cache.has(`${this.#guildID}::${ID}`)) return this.#client.roles.getSync(`${this.#guildID}::${ID}`) as Role;
		return null;
	}
}
module.exports = exports.default;