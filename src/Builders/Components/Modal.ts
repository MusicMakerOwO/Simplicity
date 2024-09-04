import ModalQuestion from "./ModalQuestion";
import ActionRow from "./ActionRow";

export default class Modal {
	public custom_id: string;
	public title: string;
	public components: Array<ModalQuestion>;

	constructor() {
		this.custom_id = Math.random().toString(36).substring(2);
		this.title = '\u200B';
		this.components = [];
	}

	setTitle(title: string): Modal {
		this.title = String(title);
		return this;
	}

	addComponent(component: ModalQuestion): Modal {
		this.components.push(component);
		return this;
	}

	toJSON(): object {
		return {
			title: this.title,
			custom_id: this.custom_id,
			components: this.components.map((c: ModalQuestion) => new ActionRow<ModalQuestion>().addComponent(c).toJSON())
		};
	}
}
module.exports = exports.default;