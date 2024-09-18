import Client from '../Client';
import { APIMessage, APIInteraction, APIInteractionData, APIInteractionEntitlement, APIInteractionContext } from '../APITypes/Objects';
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

import SnowflakeToDate from '../Utils/SnowflakeToDate';

import Collector from './Collector';

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
	public readonly guild: Guild | null;
	public readonly guild_id: string;
	public readonly channel: Channel | null;
	public readonly channel_id: string;
	public readonly member: Member | null;
	public readonly user: User | null;
	public readonly token: string;
	public readonly version: number;
	public readonly app_permissions: string;
	public readonly locale: string | null;
	public readonly guild_locale: string;
	public readonly entitlements: APIInteractionEntitlement[];
	public readonly authorizing_integration_owners: Record<string, string>;
	public readonly context: APIInteractionContext;

	public readonly customID: string;
	public readonly commandName: string;
	
	public readonly created_at: Date;
	public message: Message | null;
	
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
		this.guild = client.guilds.getSync(data.guild?.id as string) ?? null;
		this.guild_id = data.guild_id;
		this.channel = data.channel ? new Channel(client, data.channel) : null;
		this.channel_id = data.channel_id;
		this.member = (data.member && this.guild) ? new Member(client, data.member, this.guild) : null;
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

		this.customID = this.data.custom_id ?? this.data.name ?? null;
		this.commandName = this.customID;

		this.replied = false;
		this.deferred = false;
		this.followup = false;
		this.modal = false;

		this.created_at = SnowflakeToDate(this.id);
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

	async fetchReply() {
		// InteractionEndpoints.GET_RESPONSE;
		if (this.isAutocomplete()) throw new Error('Cannot fetch a reply on autocomplete interactions');
		if (this.isModalSubmit()) throw new Error('Cannot fetch a reply on modal submit interactions');

		if (!this.replied) throw new Error('Cannot fetch a reply that does not exist, you must reply() first');

		const endpoint = ResolveEndpoint(InteractionEndpoints.GET_RESPONSE, { interaction: this, client: this.#client });
		const data = await this.#client.wsClient?.SendRequest('GET', endpoint) as APIMessage;
		this.message = new Message(this.#client, data);
		return this.message;
	}

	async reply(content: any) : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot reply() to an autocomplete interaction, use autocomplete() instead');

		if (this.replied || this.deferred) return await this.editReply(content);

		const messagePaylod = ConvertMessagePayload(content);
		const payload = {
			type: InteractionCallbackType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: messagePaylod
		}
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.replied = true;

		await this.fetchReply();		
	}

	async editReply(content: any) : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot edit an autocomplete interaction, there is no message to edit');

		if (!this.replied || !this.deferred) return await this.reply(content);

		const payload = ConvertMessagePayload(content);
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('PATCH', endpoint, { body: payload });
	}

	async deleteReply() : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot delete an autocomplete interaction, there is no message to delete');

		if (!this.deferred && !this.replied) throw new Error('Cannot delete a reply that does not exist, either reply or defer first');

		const endpoint = ResolveEndpoint(InteractionEndpoints.DELETE_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('DELETE', endpoint);
	}

	async deferInteraction(data: any, callbackType: InteractionCallbackType, method: 'POST' | 'PATCH', endpoint: string) : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot defer an autocomplete interaction, consider caching your results for faster responses');

		if (this.replied) throw new Error('Cannot defer after replying to the interaction');
		if (this.deferred) throw new Error('Cannot defer twice an interaction twice');
		if (this.followup) throw new Error('Cannot defer after following up to the interaction');
		if (this.modal) throw new Error('Cannot defer after showing a modal');
	
		const messagePayload = ConvertMessagePayload(data);
		const payload = {
			type: callbackType,
			data: messagePayload
		};
	
		await this.#client.wsClient?.SendRequest(method, endpoint, { body: payload });
	
		this.deferred = true;
		this.replied = true;
	
		const MESSAGE_PROPERTIES = ['content', 'embeds', 'components'];
		const hasMessage = Object.keys(messagePayload).some(key => MESSAGE_PROPERTIES.includes(key));
		if (hasMessage) {
			await this.editReply(data);
		}
	}
	
	async deferReply(data: any) : Promise<void> {
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.deferInteraction(data, InteractionCallbackType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, 'POST', endpoint);
	}
	
	async deferUpdate(data: any) : Promise<void> {
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_RESPONSE, { interaction: this, client: this.#client });
		await this.deferInteraction(data, InteractionCallbackType.DEFERRED_UPDATE_MESSAGE, 'PATCH', endpoint);
	}

	async followUp(data: any) : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot use followUp() on autocomplete interactions');

		if (this.modal) throw new Error('Cannot follow up after showing a modal');

		const messagePaylod = ConvertMessagePayload(data);
		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_FOLLOWUP, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: messagePaylod });
		this.followup = true;
	}

	async editFollowUp(id: string, data: any) : Promise<void> {
		if (!this.followup) throw new Error('Cannot edit a followup that does not exist, use followUp() first');

		const messagePaylod = ConvertMessagePayload(data);
		const endpoint = ResolveEndpoint(InteractionEndpoints.EDIT_FOLLOWUP, { interaction: this, client: this.#client, message: { id } });
		await this.#client.wsClient?.SendRequest('PATCH', endpoint, { body: messagePaylod });
	}

	async showModal(data: Modal) : Promise<void> {
		if (this.isAutocomplete()) throw new Error('Cannot show a modal after an autocomplete interaction');

		if (this.deferred) throw new Error('Cannot show a modal after deferring the interaction');
		if (this.replied) throw new Error('Cannot show a modal after replying to the interaction');
		if (this.followup) throw new Error('Cannot show a modal after following up to the interaction');
		if (this.modal) throw new Error('Cannot show a modal twice');

		const modal = typeof data.toJSON === 'function' ? data.toJSON() : data;
		const payload = {
			type: InteractionCallbackType.MODAL,
			data: modal
		}

		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this, client: this.#client });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.modal = true;
	}

	// interaction.autocomplete(
	//   { name: 'test', value: 'test' },
	//   { name: 'test2', value: 'test2' }
	// );
	// interaction.autocomplete([
	//   { name: 'test', value: 'test' },
	//   { name: 'test2', value: 'test2' }
	// ]);
	// interaction.autocomplete(['test', 'test2']);
	// interaction.autocomplete('test', 'test2');

	async autocomplete(...data: Array<string> | Array<{ name: string, value?: string }>) : Promise<void> {
		if (!this.isAutocomplete()) throw new Error('This function can only be used on autocomplete interactions');
		if (this.replied) throw new Error('You have already sent a response to this interaction');

		const options: Array<{ name: string, value?: string }> = [];

		for (const item of data.flat(Infinity)) {
			if (typeof item === 'string') {
				options.push({ name: item, value: item });
			} else {
				if (!item.value) item.value = item.name;
				options.push(item);
			}
		}

		const payload = {
			type: InteractionCallbackType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
			data: {
				choices: options
			}
		}

		const endpoint = ResolveEndpoint(InteractionEndpoints.CREATE_RESPONSE, { interaction: this });
		await this.#client.wsClient?.SendRequest('POST', endpoint, { body: payload });

		this.replied = true;
	}

	createCollector() {
		if (this.isAutocomplete()) throw new Error('Cannot create a collector for an autocomplete interaction');
		if (this.isModalSubmit()) throw new Error('Cannot create a collector for a modal submit interaction');

		if (!this.replied) throw new Error('Cannot create a collector before replying to the interaction');
		if (!this.message) throw new Error('Cannot create a collector before fetching the reply');

		// @ts-ignore
		return new Collector(this.#client, this);
	}
}
module.exports = exports.default;