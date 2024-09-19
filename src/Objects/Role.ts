import Client from '../Client';
import { APIRole, APIRoleTags } from '../APITypes/Objects';

import SnowflakeToDate from '../Utils/SnowflakeToDate';

export default class Role {
	public readonly id: string;
	public readonly name: string;
	public readonly color: number;
	public readonly hoist: boolean;
	public readonly icon: string | undefined;
	public readonly unicode_emoji: string | undefined;
	public readonly position: number;
	public readonly permissions: string;
	public readonly managed: boolean;
	public readonly mentionable: boolean;
	public readonly tags: APIRoleTags;
	public readonly flags: number;

	public readonly created_at: Date;

	constructor(client: Client, data: APIRole) {
		this.id = data.id;
		this.name = data.name;
		this.color = data.color;
		this.hoist = Boolean(data.hoist);
		this.icon = data.icon;
		this.unicode_emoji = data.unicode_emoji;
		this.position = data.position;
		this.permissions = data.permissions;
		this.managed = Boolean(data.managed);
		this.mentionable = Boolean(data.mentionable);
		this.tags = data.tags ?? {};
		this.flags = data.flags;

		this.created_at = SnowflakeToDate(this.id);
	}

	static equals(role1: Object & { id: string }, role2: Object & { id: string }) {
		return role1.id === role2.id;
	}

	equals(role: Object & { id: string }) {
		return Role.equals(this, role);
	}
}
module.exports = exports.default;