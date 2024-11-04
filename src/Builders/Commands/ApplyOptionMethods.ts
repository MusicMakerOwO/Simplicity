import StringOption from '../CommandOptions/StringOption';
import ChannelOption from '../CommandOptions/ChannelOption';
import UserOption from '../CommandOptions/UserOption';
import NumberOption from '../CommandOptions/NumberOption';
import RoleOption from '../CommandOptions/RoleOption';
import IntegerOption from '../CommandOptions/IntegerOption';
import BooleanOption from '../CommandOptions/BooleanOption';
import AttachmentOption from '../CommandOptions/AttachmentOption';
import MentionableOption from '../CommandOptions/MentionableOption';

declare type ClassObject<T> = new (...args: unknown[]) => T;

export default class ApplyOptionMethods {

	addOption<T extends { toJSON: () => Object}>(obj: ClassObject<T>, fn: (x: T) => T) : this {
		const option = fn( new obj() );
		const object = typeof option.toJSON === 'function' ? option.toJSON() : option;
		// @ts-ignore
		if (!this.options) this.options = [];
		// @ts-ignore
		this.options.push(object);
		return this;
	}

	stringOption(fn: (x: StringOption) => StringOption) {
		return this.addOption(StringOption, fn);
	}

	roleOption(fn: (x: RoleOption) => RoleOption) {
		return this.addOption(RoleOption, fn)
	}

	integerOption(fn: (x: IntegerOption) => IntegerOption) {
		return this.addOption(IntegerOption, fn)
	}

	channelOption(fn: (x: ChannelOption) => ChannelOption) {
		return this.addOption(ChannelOption, fn)
	}

	attachmentOption(fn: (x: AttachmentOption) => AttachmentOption) {
		return this.addOption(AttachmentOption, fn)
	}

	userOption(fn: (x: UserOption) => UserOption) {
		return this.addOption(UserOption, fn)
	}
	
	numberOption(fn: (x: NumberOption) => NumberOption) {
		return this.addOption(NumberOption, fn);
	}

	booleanOption(fn: (x: BooleanOption) => BooleanOption) {
		return this.addOption(BooleanOption, fn);
	}

	mentionableOption(fn: (x: MentionableOption) => MentionableOption) {
		return this.addOption(MentionableOption, fn);
	}

	static applyOptions(obj: any, props?: string[]) {
		for (const key of Object.getOwnPropertyNames(ApplyOptionMethods.prototype)) {
			if (props && !props.includes(key)) continue;
			// @ts-ignore
			obj.prototype[key] = ApplyOptionMethods.prototype[key];
		}
	}
}
module.exports = exports.default;