import Client from "../Client";
import { APIInvite } from "../APITypes/Objects";
import { APIEvents } from "../APITypes/Enums";
import Invite from "../Objects/Invite";

export default {
	name: APIEvents.INVITE_CREATE,
	execute: function (client: Client, data: APIInvite) {
		const invite = new Invite(client, data);
		client.emit('inviteDelete', invite);
	}
}