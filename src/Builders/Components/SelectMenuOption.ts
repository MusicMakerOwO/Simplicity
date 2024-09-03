/*
label	string	User-facing name of the option; max 100 characters
value	string	Dev-defined value of the option; max 100 characters
description?	string	Additional description of the option; max 100 characters
emoji?	partial emoji object	id, name, and animated
default?	boolean	Will show this option as selected by default
*/

export default class SelectMenuOption {
	private label: string;
	private value: string;
	private description: string | null;
	private emoji: { id: string, name: string, animated: boolean } | null;
	private default: boolean;

	constructor() {
		this.label = '';
		this.value = '';
		this.description = null;
		this.emoji = null;
		this.default = false;
	}

	setLabel(label: string) {
		if (label.length > 100) throw new Error('SelectMenuOption label cannot exceed 100 characters');
		this.label = label;
		return this;
	}

	setValue(value: string) {
		if (value.length > 100) throw new Error('SelectMenuOption value cannot exceed 100 characters');
		this.value = value;
		return this;
	}

	setDescription(description: string) {
		if (description.length > 100) throw new Error('SelectMenuOption description cannot exceed 100 characters');
		this.description = description;
		return this;
	}

	setEmoji(emoji: { id: string, name: string, animated: boolean }) {
		this.emoji = emoji;
		return this;
	}

	setDefault(defaultValue: boolean) {
		this.default = defaultValue;
		return this;
	}

	toJSON() {
		return {
			label: this.label,
			value: this.value,
			description: this.description,
			emoji: this.emoji,
			default: this.default
		};
	}
}