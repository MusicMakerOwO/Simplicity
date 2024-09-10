import Client from '../Client';
import { APIMember } from '../APITypes/Objects';

import Guild from './Guild';
import User from './User';

export default class Member extends User {
	public readonly user: User;
	public readonly nick: string | null;
	public readonly roles: string[];
	public readonly joined_at: Date;
	public readonly premium_since: string | null;
	public readonly deaf: boolean;
	public readonly mute: boolean;
	public readonly pending: boolean;
	public readonly permissions: string;
	public readonly guild: Guild;

	constructor(client: Client, data: APIMember, guild: Guild) {
		super(client, data.user);

		this.user = new User(client, data.user);
		this.nick = data.nick ?? null;
		this.roles = data.roles;
		this.joined_at = new Date(data.joined_at);
		this.premium_since = data.premium_since ?? null;
		this.deaf = Boolean(data.deaf);
		this.mute = Boolean(data.mute);
		this.pending = Boolean(data.pending);
		this.permissions = data.permissions ?? '';
		this.guild = guild;
	}
}
module.exports = exports.default;