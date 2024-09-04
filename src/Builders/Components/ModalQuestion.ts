/*
type	integer	4 for a text input
custom_id	string	Developer-defined identifier for the input; max 100 characters
style	integer	The Text Input Style
label	string	Label for this component; max 45 characters
min_length?	integer	Minimum input length for a text input; min 0, max 4000
max_length?	integer	Maximum input length for a text input; min 1, max 4000
required?	boolean	Whether this component is required to be filled (defaults to true)
value?	string	Pre-filled value for this component; max 4000 characters
placeholder?	string	Custom placeholder text if the input is empty; max 100 characters
*/

export default class ModalQuestion {
	public readonly type: 4;
	public custom_id: string;
	public style: 1 | 2;
	public label: string;
	public min_length?: number;
	public max_length?: number;
	public required?: boolean;
	public value?: string;
	public placeholder?: string;

	constructor() {
		this.type = 4;
		this.custom_id = Math.random().toString(36).substring(2);
		this.style = 1;
		this.label = '\u200b';
	}

	setCustomID(custom_id: string) {
		if (custom_id.length > 100) throw new Error('Button custom id cannot exceed 100 characters');
		this.custom_id = custom_id;
		return this;
	}

	setStyle(style: 1 | 2) {
		if (style !== 1 && style !== 2) throw new Error('Invalid button style - Must be 1 or 2');
		this.style = style;
		return this;
	}

	setLabel(label: string) {
		if (label.length > 45) throw new Error('Button label cannot exceed 45 characters');
		this.label = label;
		return this;
	}

	setMinLength(min_length: number) {
		if (min_length < 0 || min_length > 4000) throw new Error('Minimum input length must be between 0 and 4000');
		this.min_length = min_length;
		return this;
	}

	setMaxLength(max_length: number) {
		if (max_length < 1 || max_length > 4000) throw new Error('Maximum input length must be between 1 and 4000');
		this.max_length = max_length;
		return this;
	}

	setRequired(required: boolean) {
		this.required = Boolean(required);
		return this;
	}

	setValue(value: string) {
		if (value.length > 4000) throw new Error('Button value cannot exceed 4000 characters');
		this.value = value;
		return this;
	}

	setPlaceholder(placeholder: string) {
		if (placeholder.length > 100) throw new Error('Button placeholder cannot exceed 100 characters');
		this.placeholder = placeholder;
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			custom_id: this.custom_id,
			style: this.style,
			label: this.label,
			min_length: this.min_length,
			max_length: this.max_length,
			required: this.required,
			value: this.value,
			placeholder: this.placeholder
		};
	}
}
module.exports = exports.default;