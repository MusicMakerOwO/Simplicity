import ComponentTypes from "../../Enums/ComponentTypes";
import Button from "./Button";
import SelectMenu from "./SelectMenu";
import ModalQuestion from "./ModalQuestion";

export default class ActionRow<T extends Button | SelectMenu | ModalQuestion> {

	public type: ComponentTypes.ACTION_ROW;
	public components: Array<T>;
	public componentTypes: number | null;

	constructor() {
		this.type = ComponentTypes.ACTION_ROW;
		this.components = [];
		this.componentTypes = null;
	}

	// dont care the type as long as component.type exists on it
	addComponent(component: T) : this {
		if (!component?.type) throw new Error('Component must have a type');
		if (this.componentTypes && this.componentTypes !== component.type) throw new Error('All components within an action row must be of the same type');
		this.components.push(component);
		this.componentTypes ??= component.type;
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			components: this.components.map((c: T) => typeof c.toJSON === 'function' ? c.toJSON() : c)
		};
	}
}
module.exports = exports.default;