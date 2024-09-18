import { APIActionRow, APIInteractionData } from "../APITypes/Objects";

// interaction.fields.getText('name') // returns the value of the field with the name 'name'

export default class InteractionModal {
	public custom_id: string;
	public questions: { [key: string]: string };

	constructor(data: APIInteractionData) {
		this.custom_id = data.custom_id;
		this.questions = {};
		this.#parseQuestions(data.components);
	}

	#parseQuestions(components: Array<APIActionRow>) {
		for (const component of components) {
			if (component.type === 1) {
				const questionData = component.components[0] as { custom_id: string, value: string, type: 4 };
				this.questions[questionData.custom_id] = questionData.value;
			}
		}
	}

	getText(name: string): string | null {
		return this.questions[name] ?? null;
	}
}
module.exports = exports.default;