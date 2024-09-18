import BaseCommand from './BaseCommand';

import StringOption from '../CommandOptions/StringOption';
import ChannelOption from '../CommandOptions/ChannelOption';
import UserOption from '../CommandOptions/UserOption';
import NumberOption from '../CommandOptions/NumberOption';
import RoleOption from '../CommandOptions/RoleOption';
import IntegerOption from '../CommandOptions/IntegerOption';
import BooleanOption from '../CommandOptions/BooleanOption';
import AttachmentOption from '../CommandOptions/AttachmentOption';
import MentionableOption from '../CommandOptions/MetionableOption';

// .stringOption( x => x.name('name').description('The name of the user').required(true) )

declare type ClassObject<T> = new (...args: unknown[]) => T;

export default class SlashCommand extends BaseCommand {

	public default_permission: number;
	public dm_permission: boolean;
	public description_localizations: { [key: string]: string };
	public nsfw: boolean;

	constructor() {
		super();
		this.default_permission = 0;
		this.dm_permission = false;
		this.description_localizations = {};
		this.nsfw = false;
	}

	addOption<T extends { toJSON: () => Object}>(constructor: ClassObject<T>, fn: (x: T) => T) : this {
		const option = fn( new constructor() );
		const object = typeof option.toJSON === 'function' ? option.toJSON() : option;
		if (!this.options) this.options = []; 
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

	setDefaultPermission(...permissions: number[]) {
		this.default_permission = permissions.reduce((acc, perm) => acc | perm, 0);
		return this;
	}

	setDMPermission(allow: boolean) {
		this.dm_permission = Boolean(allow);
		return this;
	}

	setDescriptionLocalization(language: string, description: string) {
		this.description_localizations[language] = description;
		return this;
	}

	setNSFW(allow: boolean) {
		this.nsfw = Boolean(allow);
		return this;
	}
	
	override toJSON() {
		return {
			...super.toJSON(),
			type: 1,
			default_permission: this.default_permission,
			dm_permission: this.dm_permission,
			description_localizations: this.description_localizations,
			nsfw: this.nsfw
		};
	}
}

module.exports = exports.default;