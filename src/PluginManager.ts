const Module = require('module');
const fs = require('fs');

const PrimaryPackage = require(`../package.json`);

const resolutionTable = new Map<string, string>();
const modificationTable = new Map<string, string>(); // originalPath -> Plugin that modified it

interface PluginPackage {
	name: string;
	version: string;
	description: string;
	author: string;
	supported_versions: string[];
}

// This a private method and almost completely undocumented
// This is a dependency of require(), it checks the cache and sends the code to the compiler if needed
// @ts-ignore
const originalLoad = Module._load;
// @ts-ignore
Module._load = function (request, parent, isMain) {
	if (request.startsWith('node:')) request = request.slice(5);
	if (Module.builtinModules.includes(request)) return originalLoad.call(this, request, parent, isMain);
	if (!request.startsWith('.')) return originalLoad.call(this, request, parent, isMain);

	// Another private method without documentation or typing
	// This resolves a relative path to an absolute path regardless of the cwd or __dirname
	// @ts-ignore
	const resolvedPath = Module._resolveFilename(request, parent, isMain);

	const resolved = resolutionTable.get(resolvedPath) || resolvedPath;
	return originalLoad.call(this, resolved, parent, isMain);
};

const files: string[] = [];
function RecursiveReadFolder(folder: string) {
	const _files = fs.readdirSync(folder, { withFileTypes: true });
	for (const file of _files) {
		if (file.isDirectory()) {
			RecursiveReadFolder(`${folder}/${file.name}`);
		} else {
			files.push(`${folder}/${file.name}`);
		}
	}
	return files;
}

const ConflictingPlugins: string[] = [];

const plugins = fs.readdirSync(`${__dirname}/../Plugins`, { withFileTypes: true });
for (const plugin of plugins) {
	if (!plugin.isDirectory()) continue;
	const pluginPath = `${__dirname}/../Plugins/${plugin.name}`;

	try {
		var pluginPackage = require(`${pluginPath}/package.json`) as PluginPackage;
	} catch (e) {
		console.error(`Failed to load "${plugin.name}" - Missing or malformed package.json file`);
		continue;
	}

	const error = VerifyPackageIntegrity(pluginPackage);
	if (error) {
		console.error(`Failed to load "${plugin.name}" - ${error}`);
		continue;
	}

	if (!pluginPackage.supported_versions.includes(PrimaryPackage.version)) {
		console.error(`[${plugin.name}] Plugin "${pluginPackage.name}" is not supported by this version of Simplicity`);
		console.error(`[${plugin.name}] Plugin will be allowed to load but may not function correctly`);
		console.error(`[${plugin.name}] Simplicity version: ${PrimaryPackage.version}`);
		console.error(`[${plugin.name}] Supported versions: ${pluginPackage.supported_versions.join(', ')}`);
	}

	const conflictingFiles: string[] = [];
	let conflict = false;

	const pluginFiles = RecursiveReadFolder(pluginPath);
	for (const file of pluginFiles) {
		const relativePath = file.replace(`${__dirname}/../Plugins/${plugin.name}/`, '');
		const originalPath = `${__dirname}/${relativePath}`;
		try {
			const originalFullPath = require.resolve(originalPath);
			const pluginFullPath = require.resolve(file);
			if (conflict) {
				conflictingFiles.push(originalPath);
				continue;
			}
			if (!resolutionTable.has(pluginFullPath)) {
				resolutionTable.set(pluginFullPath, originalFullPath);
				modificationTable.set(originalFullPath, plugin.name);
			} else {
				conflict = true;
				const conflictingPlugin = modificationTable.get(originalFullPath) as string;
				if (!ConflictingPlugins.includes(conflictingPlugin)) {
					ConflictingPlugins.push(conflictingPlugin);
				}
				if (!ConflictingPlugins.includes(plugin.name)) {
					ConflictingPlugins.push(plugin.name);
				}
				conflictingFiles.push(originalPath);
				continue;
			}
		} catch (e) {
			// ignore, file doesn't exist
		}
	}
}

function VerifyPackageIntegrity(pluginPackage: PluginPackage) {
	if (typeof pluginPackage.name !== 'string') return 'Invalid name, must be a string';
	if (typeof pluginPackage.version !== 'string') return 'Invalid version, must be a string';
	if (typeof pluginPackage.author !== 'string') return 'Invalid author, must be a string';
	if (!Array.isArray(pluginPackage.supported_versions)) return 'Invalid supported_versions, must be an array';
	for (let i = 0; i < pluginPackage.supported_versions.length; i++) {
		if (typeof pluginPackage.supported_versions[i] !== 'string') return 'Invalid supported_versions, must be an array of strings';
	}
}