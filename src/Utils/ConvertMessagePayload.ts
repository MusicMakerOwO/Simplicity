import Embed from '../Builders/Embed';
import ActionRow from '../Builders/Components/ActionRow';

interface MessagePayload {
	content: string;
	embeds?: Array<Embed>;
	components?: Array<ActionRow<any>>;
	hidden: boolean;
	flags?: number;
}

export default function ConvertMessagePayload(data: any): MessagePayload {
	if (!data) throw new Error('Invalid message payload, expected an object or string');
	if (typeof data === 'string') return ConvertHiddenFlag({ content: data, hidden: false })

	// if ("components" in data) {
	// 	if (data.components.length > 5) throw new Error('Cannot have more than 5 components in a message');
	// 	// @ts-ignore
	// 	data.components = data.components.map((c: Object & { type: number }) => c.type === 1 ? c : new ActionRow().addComponent(c));
	// }
	
	if ("type" in data) {
		const payload: MessagePayload = { content: data.content, hidden: Boolean(data.hidden), components: [] };
		// Action row, forgot to wrap in message.components
		if (data.type === 1) payload.components = [ data ];
		// Button or select menu, forgot to wrap in action row
		if (data.type === 2 || data.type === 3) payload.components = [ new ActionRow().addComponent(data) ];
		
		return ConvertHiddenFlag(payload);
	}

	return ConvertHiddenFlag({
		content: data.content,
		embeds: data.embeds,
		components: data.components,
		hidden: data.hidden ?? false
	});
}

function ConvertHiddenFlag(data: MessagePayload): MessagePayload {
	if (data.hidden) data.flags = 64;
	return data;
}
module.exports = exports.default;