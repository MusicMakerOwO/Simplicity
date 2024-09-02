import ComponentTypes from "../Enums/ComponentTypes";

export default class ActionRow<T extends { type: number, toJSON?: Function }> {
	private type: ComponentTypes.ACTION_ROW;
	private components: Array<T>;
	private componentTypes: number | null;

	constructor() {
		this.type = ComponentTypes.ACTION_ROW;
		this.components = [];
		this.componentTypes = null;
	}

	// dont care the type as long as component.type exists on it
	addComponent(component: T) {
		if (!component?.type) throw new Error('Component must have a type');
		if (this.componentTypes && this.componentTypes !== component.type) throw new Error('All components within an action row must be of the same type');
		this.components.push(component);
		this.componentTypes ??= component.type;
	}

	toJSON() {
		return {
			type: this.type,
			components: this.components.map((c: T) => typeof c.toJSON === 'function' ? c.toJSON() : c)
		};
	}
}