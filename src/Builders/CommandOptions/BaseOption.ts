/*
type	one of application command option type	Type of option	all
name *	string	1-32 character name	all
name_localizations?	?dictionary with keys in available locales	Localization dictionary for the name field. Values follow the same restrictions as name	all
description	string	1-100 character description	all
description_localizations?	?dictionary with keys in available locales	Localization dictionary for the description field. Values follow the same restrictions as description	all
required?	boolean	Whether the parameter is required or optional, default false	all but SUB_COMMAND and SUB_COMMAND_GROUP
choices?	array of application command option choice	Choices for the user to pick from, max 25	STRING, INTEGER, NUMBER
options?	array of application command option	If the option is a subcommand or subcommand group type, these nested options will be the parameters or subcommands respectively; up to 25	SUB_COMMAND , SUB_COMMAND_GROUP
channel_types?	array of channel types	The channels shown will be restricted to these types	CHANNEL
min_value?	integer for INTEGER options, double for NUMBER options	The minimum value permitted	INTEGER , NUMBER
max_value?	integer for INTEGER options, double for NUMBER options	The maximum value permitted	INTEGER , NUMBER
min_length?	integer	The minimum allowed length (minimum of 0, maximum of 6000)	STRING
max_length?	integer	The maximum allowed length (minimum of 1, maximum of 6000)	STRING
autocomplete? **	boolean	If autocomplete interactions are enabled for this option	STRING, INTEGER, NUMBE
*/

export default class BaseOption {
	public type: number;
	public name: string;
	public description: string;
	
	constructor(type: number) {
		this.type = type;
		this.name = 'myOption';
		this.description = '\u200b';
	}

	setName(name: string) {
		if (name.length < 1 || name.length > 32) throw new Error('Option name must be between 1 and 32 characters');
		this.name = String(name);
		return this;
	}

	setDescription(description: string) {
		if (description.length < 1 || description.length > 100) throw new Error('Option description must be between 1 and 100 characters');
		this.description = String(description);
		return this;
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name,
			description: this.description
		};
	}
}

module.exports = exports.default;