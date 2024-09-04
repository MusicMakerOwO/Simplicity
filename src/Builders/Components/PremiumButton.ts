import ButtonStyles from '../../Enums/ButtonStyles';
import ComponentTypes from '../../Enums/ComponentTypes';

export default class PremiumButton {

	public type: ComponentTypes.BUTTON;
	public style: ButtonStyles.PREMIUM;
	public sku_id: string;

	/*
	Premium buttons must contain a sku_id, and cannot have a custom_id, label, url, or emoji.
	*/

	constructor(sku_id: string) {
		this.type = 2;
		this.style = 6;
		this.sku_id = sku_id;
	}

	setSKU(sku_id: string) {
		if (sku_id.length > 100) throw new Error('Button sku_id cannot exceed 100 characters');
		this.sku_id = sku_id;
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			style: this.style,
			sku_id: this.sku_id
		};
	}
}
module.exports = exports.default;