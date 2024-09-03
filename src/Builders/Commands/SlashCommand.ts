import BaseCommand from './BaseCommand';

export default class SlashCommand extends BaseCommand {
	private default_permission: number;
	private dm_permission: boolean;
	private description_localizations: { [key: string]: string };
	private nsfw: boolean;

	constructor() {
		super();
		this.default_permission = 0;
		this.dm_permission = false;
		this.description_localizations = {};
		this.nsfw = false;
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
