import { MessagePayload } from '../Types/MessagePayloads';
import ActionRow from '../Builders/Components/ActionRow';

export default function ConvertMessagePayload(data: any): MessagePayload {
	if (!data) throw new Error('Invalid message payload, expected an object or string');
	if (typeof data === 'string') return { content: data, hidden: false };

	if ("type" in data) {
		const payload: MessagePayload = { content: data.content, hidden: Boolean(data.hidden), components: [] };
		// Action row, forgot to wrap in message.components
		if (data.type === 1) payload.components = [ data ];
		// Button or select menu, forgot to wrap in action row
		if (data.type === 2 || data.type === 3) payload.components = [ new ActionRow().addComponent(data) ];

		return payload;
	}

	return {
		content: data.content,
		embeds: data.embeds,
		components: data.components,
		hidden: data.hidden ?? false
	};
}
module.exports = exports.default;