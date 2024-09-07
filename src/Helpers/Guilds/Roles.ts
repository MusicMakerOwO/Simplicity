import Client from '../../Client';
import Role from '../../Objects/Role';
import { APIRole } from '../../APITypes/Objects';
import { Endpoints } from '../../Objects/Role';
import ResolveEndpoint from '../../Utils/ResolveEndpoint';

import Helper from '../Helper';

export default class GuildRoleHelper extends Helper {
	#client: Client;
	constructor(client: Client, guildID: string, roles: Array<APIRole>) {
		super(guildID);
		this.#client = client;

		for (const role of roles) {
			this.#map.set(role.id, this.#WrapInClass(role));
		}
	}

	#WrapInClass(data: APIRole): Role | undefined {
		if (!data) return undefined;
		return new Role(this.#client, data);
	}

	#map = {
		// essnetially super.super.set(id, role), can't reach a grandparent class
		set: Map.prototype.set.bind(this),
		get: Map.prototype.get.bind(this),
	}

	override set(id: string, role: APIRole): this {
		this.#client.roles.set(`${this.guildID}::${id}`, role);
		this.#map.set(id, this.#WrapInClass(role));
		return this;
	}

	override async get(id: string): Promise<Role | undefined> {
		return await this.#client.roles.get(`${this.guildID}::${id}`);
	}

	override async getAll(): Promise<Role[]> {
		const endpoint = ResolveEndpoint(Endpoints.GET_ROLES, { guild: { id: this.guildID } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as APIRole[];
		const roles = data.map(role => new Role(this.#client, role));
		roles.forEach(role => this.set(role.id, role));
		return roles;
	}

	override async fetch(id: string): Promise<Role | undefined> {
		if (!id) throw new Error('Role ID is required - If trying to fetch everything, use getAll()');

		const endpoint = ResolveEndpoint(Endpoints.GET_ROLE, { guild: { id: this.guildID }, role: { id } });
		const data = await this.#client.ws?.SendRequest('GET', endpoint) as Role;
		const role = new Role(this.#client, data);
		this.set(role.id, role);
		return role;
	}
}

module.exports = exports.default;