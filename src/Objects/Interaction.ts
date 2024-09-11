import Client from '../Client';
import { APIInteraction, APIInteractionData, APIInteractionEntitlement, APIInteractionContext } from '../APITypes/Objects';
import InteractionType from '../Enums/InteractionType';

import Guild from './Guild';
import Channel from './Channel';
import Member from './Member';
import User from './User';
import Message from './Message';

import InteractionEndpoints from '../APITypes/Endpoints/Interactions';
import ConvertMessagePayload from '../Utils/ConvertMessagePayload';
import ResolveEndpoint from '../Utils/ResolveEndpoint';

/*
export declare type APIInteraction = {
	id: string;
	application_id: string;
	type: number;
	data: APIInteractionData;
	guild?: APIGuild;
	guild_id: string;
	channel?: APIChannel;
	channel_id: string;
	member?: APIMember;
	user?: APIUser;
	token: string;
	version: number;
	message?: APIMessage;
	app_permissions: string;
	locale?: string;
	guild_locale: string;
	entitlements: Array<APIInteractionEntitlement>;
	authorizing_integration_owners: Record<string, string>;
	context: APIInteractionTypes;
};
*/

export default class Interaction {
	#client: Client;

	public readonly id: string;
	public readonly application_id: string;
	public readonly type: number;
	public readonly data: APIInteractionData;
	// public readonly guild: Guild | null;
	public readonly guild_id: string;
	public readonly channel: Channel | null;
	public readonly channel_id: string;
	public readonly member: Member | null;
	public readonly user: User | null;
	public readonly token: string;
	public readonly version: number;
	public readonly message: Message | null;
	public readonly app_permissions: string;
	public readonly locale: string | null;
	public readonly guild_locale: string;
	public readonly entitlements: APIInteractionEntitlement[];
	public readonly authorizing_integration_owners: Record<string, string>;
	public readonly context: APIInteractionContext;

	constructor(client: Client, data: APIInteraction) {
		this.#client = client;

		this.id = data.id;
		this.application_id = data.application_id;
		this.type = data.type;
		this.data = data.data;
		// https://github.com/MusicMakerOwO/Simplicity/issues/1
		// this.guild = data.guild ? client.guilds.getSync(data.guild.id) ?? null : null;
		this.guild_id = data.guild_id;
		this.channel = data.channel ? new Channel(client, data.channel) : null;
		this.channel_id = data.channel_id;
		this.member = (data.member && data.guild) ? new Member(client, data.member, data.guild as unknown as Guild) : null;
		this.user = data.user ? new User(client, data.user) : null;
		this.token = data.token;
		this.version = data.version;
		this.message = data.message ? new Message(client, data.message) : null;
		this.app_permissions = data.app_permissions;
		this.locale = data.locale ?? null;
		this.guild_locale = data.guild_locale;
		this.entitlements = data.entitlements;
		this.authorizing_integration_owners = data.authorizing_integration_owners;
		this.context = data.context;

	}

	isButton() {
		return this.type === InteractionType.MESSAGE_COMPONENT && this.data.type === 2;
	}

	isSelectMenu() {
		return this.type === InteractionType.MESSAGE_COMPONENT && this.data.type === 3;
	}

	isCommand() {
		return this.type === InteractionType.SLASH_COMMAND;
	}

	isAutocomplete() {
		return this.type === InteractionType.COMMAND_AUTOCOMPLETE;
	}

	isModalSubmit() {
		return this.type === InteractionType.MODAL_SUBMIT;
	}

	isPing() {
		return this.type === InteractionType.PING;
	}

	async reply(content: any) {
		const messagePaylod = ConvertMessagePayload(content);
		const payload = {
			type: 4,
			data: messagePaylod
		}
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });
	}

}
module.exports = exports.default;