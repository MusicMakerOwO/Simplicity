import SelectMenuOption from "./SelectMenuOption";
import ComponentTypes from "../Enums/ComponentTypes";

export default class SelectMenu {
	private type: ComponentTypes.STRING_SELECT;
	private custom_id: string;
	private placeholder: string | null;
	private options: Array<SelectMenuOption>;
	private min_values: number | null;
	private max_values: number | null;
	private disabled: boolean;

	constructor() {
		this.type = ComponentTypes.STRING_SELECT;
		this.custom_id = Math.random().toString(36).substring(2);
		this.placeholder = '';
		this.options = [];
		this.min_values = null;
		this.max_values = null;
		this.disabled = false;
	}

	setCustomID(custom_id: string) {
		if (custom_id.length > 100) throw new Error('SelectMenu custom_id cannot exceed 100 characters');
		this.custom_id = custom_id;
		return this;
	}

	setPlaceholder(placeholder: string) {
		if (placeholder.length > 100) throw new Error('SelectMenu placeholder cannot exceed 100 characters');
		this.placeholder = placeholder;
		return this;
	}

	addOption(...option: SelectMenuOption[]) {
		option = option.flat();
		this.options.push(...option);
		return this;
	}

	setMinValues(min_values: number) {
		if (min_values < 0 || min_values > 25) throw new Error('SelectMenu min_values must be between 0 and 25');
		this.min_values = min_values;
		return this;
	}

	setMaxValues(max_values: number) {
		if (max_values < 0 || max_values > 25) throw new Error('SelectMenu max_values must be between 0 and 25');
		this.max_values = max_values;
		return this;
	}

	setDisabled(disabled: boolean) {
		this.disabled = disabled;
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			custom_id: this.custom_id,
			placeholder: this.placeholder,
			options: this.options.map((o: SelectMenuOption) => o.toJSON()),
			min_values: this.min_values,
			max_values: this.max_values,
			disabled: this.disabled
		};
	}
}
