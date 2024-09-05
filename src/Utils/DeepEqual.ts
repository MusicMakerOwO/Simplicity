export type BlueprintValue = { required: boolean, type: string | number | boolean | BlueprintObject | Array<BlueprintObject> };
export type BlueprintObject = { [key: string]: BlueprintValue | BlueprintObject | Array<BlueprintObject> };
export type Blueprint = BlueprintObject | Array<BlueprintObject>;

export default function DeepEqual(data: any, blueprint: Blueprint | BlueprintObject | Array<Blueprint> ): boolean {

	if (typeof data !== typeof blueprint) return false;
	if (!data && !blueprint) return true;

	for (const key of Object.keys(data)) {
		if (!(key in blueprint)) return false;
	}
	
	for (const [ key, type ] of Object.entries(blueprint)) {

		if (Array.isArray(type)) {
			if (!Array.isArray(data)) return false;
			if (typeof data[0] !== typeof type[0]) return false;
			for (let i = 0; i < data.length; i++) {
				if (!DeepEqual(data[i], type[0])) return false;
			}
			continue;
		}

		if (typeof type === 'object') {
			// Either object or value
			if ('required' in type && 'type' in type) {
				// Value
				let newType = type as unknown as BlueprintValue;
				if (newType.required) {
					if (!(key in data)) return false;
					if (typeof data[key] !== newType.type) return false;
				} else {
					if (key in data && typeof data[key] !== newType.type) return false;
				}
				continue;
			}
			
			// Object
			if (!DeepEqual(data[key], type as BlueprintObject)) return false;
		}
	}

	return true;
}
module.exports = exports.default;