import Client from "../Client";
import { APIInvite } from "../APITypes/Objects";

import InviteEndpoints from "../APITypes/Endpoints/Invites";
import ResolveEndpoint from "../Utils/ResolveEndpoint";

import User from "./User";

/*
export declare type APIInvite = {
	channel_id: string;
	code: string;
	created_at: string;
	guild_id?: string;
	inviter?: APIUser;
	max_age: number;
	max_uses: number;
	target_type?: number;
	target_user?: APIUser;
	target_application?: any;
	temporary: boolean;
	uses: number;
}
*/

export default class Invite {
	#client: Client;
	
	public readonly code: string;
	public readonly channelID: string;
	public readonly guildID: string | null;
	public readonly inviter: User | null;
	public readonly maxAge: number;
	public readonly maxUses: number;
	public readonly targetUser: User | null;
	public readonly targetApplication: any;
	public readonly temporary: boolean;
	public readonly uses: number;

	public readonly created_at: Date;
	public readonly expires_at: Date | null;

	constructor(client: Client, data: APIInvite) {
		this.#client = client;
		this.#client;

		this.code = data.code;
		this.channelID = data.channel_id;
		this.guildID = data.guild_id ?? null;
		this.inviter = data.inviter ? new User(client, data.inviter) : null;
		this.maxAge = data.max_age; // 0 if infinite
		this.maxUses = data.max_uses;
		this.targetUser = data.target_user ? new User(client, data.target_user) : null;
		this.targetApplication = data.target_application;
		this.temporary = data.temporary;
		this.uses = data.uses;

		this.created_at = new Date(data.created_at);
		this.expires_at = data.max_age
			? new Date(this.created_at.getTime() + data.max_age * 1000)
			: null;
	}

	getURL(): string {
		return `https://discord.gg/${this.code}`;
	}

	toString(): string {
		return this.getURL();
	}

	inspect(): string {
		return `<Invite ${this.code}>`;
	}

	async delete() {
		const endpoint = ResolveEndpoint(InviteEndpoints.DELETE_INVITE, { invite: this });
		await this.#client.wsClient.SendRequest(endpoint, 'DELETE');
	}
	
}
module.exports = exports.default;