import BaseCommand from './BaseCommand';
import ApplyOptionMethods from './ApplyOptionMethods';
import SubCommand from './SubCommand';
import SubCommandGroup from './SubCommandGroup';

class SlashCommand extends BaseCommand {
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

	subCommand(fn: (subcommand: SubCommand) => void) {
		// @ts-ignore
		return this.addOption(SubCommand, fn);
	}

	subCommandGroup(fn: (subcommand: SubCommandGroup) => void) {
		// @ts-ignore
		return this.addOption(SubCommandGroup, fn);
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
ApplyOptionMethods.applyOptions(SlashCommand);
export default SlashCommand;
module.exports = exports.default;