import ButtonStyles from "../../Enums/ButtonStyles";
import ComponentTypes from "../../Enums/ComponentTypes";

export default class Button {

	static ImportButton(button: unknown) {
		// TODO
	}

	public type: ComponentTypes.BUTTON;
	public label: string;
	public style: 1 | 2 | 3 | 4 | 5 | 6;
	public custom_id: string;
	public disabled?: boolean;
	public url?: string;
	public emoji?: { id: string, name: string, animated: boolean };

	constructor(button: unknown) {
		this.type = ComponentTypes.BUTTON;
		this.label = '\u200b';
		this.style = 2;
		this.custom_id = Math.random().toString(36).substring(2); // random string if no custom id is provided
		this.disabled = false;
	}

	setSKU() {
		throw new Error('Normal buttons cannot contain a sku_id, use a PremiumButton instead!');
	}

	setLabel(label: string) {
		if (label.length > 80) throw new Error('Button label cannot exceed 80 characters');
		this.label = label;
		return this;
	}

	setStyle(style: number) {
		if (!(style in ButtonStyles)) throw new Error('Invalid button style - Must be between 1 and 6, try using the ButtonStyles enum');
		if (style < 1 || style > 6) throw new Error('Invalid button style - Must be between 1 and 6');
		this.style = style as 1 | 2 | 3 | 4 | 5 | 6;
		return this;
	}

	setCustomID(custom_id: string) {
		if (custom_id.length > 100) throw new Error('Button custom id cannot exceed 100 characters');
		this.custom_id = custom_id;
		return this;
	}

	setDisabled(disabled: boolean) {
		this.disabled = Boolean(disabled);
		return this;
	}

	setURL(url: string) {
		if (url.length > 512) throw new Error('Button URL cannot exceed 512 characters');
		if (!url.startsWith('http')) throw new Error('Button URL must start with http or https');
		this.url = url;
		return this;
	}

	setEmoji(emoji: { id: string, name: string, animated: boolean } | string | null) {
		if (typeof emoji === 'string') {
			const parseEmojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
			const parsedEmoji = parseEmojiRegex.exec(emoji);
			if (parsedEmoji === null) throw new Error('Invalid emoji format - Use <a:name:id> or <:name:id>');
			this.emoji = {
				id: parsedEmoji[3],
				name: parsedEmoji[2],
				animated: Boolean(parsedEmoji[1])
			};
		} else if (emoji === null) {
			this.emoji = undefined;
		} else {
			this.emoji = emoji;
		}
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			label: this.label,
			style: this.style,
			custom_id: this.custom_id,
			disabled: this.disabled,
			url: this.url,
			emoji: this.emoji
		};
	}
}
module.exports = exports.default;