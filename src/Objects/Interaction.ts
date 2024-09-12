import Client from '../Client';
import { APIInteraction, APIInteractionData, APIInteractionEntitlement, APIInteractionContext } from '../APITypes/Objects';
import InteractionType from '../Enums/InteractionType';

import Guild from './Guild';
import Channel from './Channel';
import Member from './Member';
import User from './User';
import Message from './Message';

import InteractionEndpoints from '../APITypes/Endpoints/Interactions';
import InteractionCallbackType from '../Enums/InteractionCallbackType';
import ConvertMessagePayload from '../Utils/ConvertMessagePayload';
import ResolveEndpoint from '../Utils/ResolveEndpoint';

import Modal from '../Builders/Components/Modal';

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

	public replied: boolean;
	public deferred: boolean;
	public followup: boolean;
	public modal: boolean;

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

		this.replied = false;
		this.deferred = false;
		this.followup = false;
		this.modal = false;
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

	async reply(content: any) : Promise<void> {
		if (this.replied || this.deferred) return await this.editReply(content);
		const messagePaylod = ConvertMessagePayload(content);
		const payload = {
			type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: messagePaylod
		}
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.replied = true;
	}

	async editReply(content: any) : Promise<void> {
		if (!this.replied) return await this.reply(content);
		const payload = ConvertMessagePayload(content);
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('PATCH', endpoint, { body: payload });
	}

	async deleteReply() : Promise<void> {
		if (!this.deferred || !this.replied) throw new Error('Cannot delete a reply that does not exist, either reply or defer first');
		const endpoint = ResolveEndpoint(InteractionEndpoints.DELETE_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('DELETE', endpoint);
	}

	async deferReply(data: any) : Promise<void> {
		if (this.deferred) throw new Error('Cannot defer twice an interaction twice');

		const messagePaylod = ConvertMessagePayload(data);
		const payload = {
			type: InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
			data: messagePaylod
		}
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.deferred = true;
		this.replied = true;

		const MESSAGE_PROPERTIES = ['content', 'embeds', 'components'];
		const hasMessage = Object.keys(messagePaylod).some(key => MESSAGE_PROPERTIES.includes(key));
		if (hasMessage) {
			await this.editReply(data);
		}
	}

	async deferUpdate(data: any) : Promise<void> {
		if (this.deferred) throw new Error('Cannot defer twice an interaction twice');
		
		const messagePaylod = ConvertMessagePayload(data);
		const payload = {
			type: InteractionCallbackType.DEFERRED_UPDATE_MESSAGE,
			data: messagePaylod
		}
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('PATCH', endpoint, { body: payload });

		this.deferred = true;
		this.replied = true;

		const MESSAGE_PROPERTIES = ['content', 'embeds', 'components'];
		const hasMessage = Object.keys(messagePaylod).some(key => MESSAGE_PROPERTIES.includes(key));
		if (hasMessage) {
			await this.editReply(data);
		}
	}

	async followUp(data: any) : Promise<void> {
		const messagePaylod = ConvertMessagePayload(data);
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_FOLLOWUP, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: messagePaylod });
		this.followup = true;
	}

	async editFollowUp(id: string, data: any) : Promise<void> {
		if (!this.followup) throw new Error('Cannot edit a followup that does not exist, use followUp() first');
		const messagePaylod = ConvertMessagePayload(data);
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_FOLLOWUP, { interaction: this, client: this.#client, id });
		await this.#client.wsClient?.SendRequest('PATCH', endpoint, { body: messagePaylod });
	}

	async showModal(data: Modal) : Promise<void> {
		if (this.deferred) throw new Error('Cannot show a modal after deferring the interaction');
		if (this.replied) throw new Error('Cannot show a modal after replying to the interaction');
		if (this.followup) throw new Error('Cannot show a modal after following up to the interaction');

		const modal = typeof data.toJSON === 'function' ? data.toJSON() : data;
		const payload = {
			type: InteractionCallbackType.MODAL,
			data: modal
		}

		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.modal = true;
	}
}
module.exports = exports.default;