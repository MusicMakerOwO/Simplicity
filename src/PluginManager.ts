const Module = require('module');
const fs = require('fs');

const RED = '\x1b[31m';
const RESET = '\x1b[0m';

const PrimaryPackage = require(`../package.json`);

const resolutionTable = new Map<string, string>();
const modificationTable = new Map<string, string>(); // originalPath -> Plugin that modified it

// 1.0.3 -> [1, 0, 3]
// 1.0.X -> [1, 0, -1]
function ConvertSemVer(versions: string) {
	const semver = versions.split('.').map((v) => (v.trim().toUpperCase() === 'X' ? -1 : parseInt(v)));
	if (semver[2] === undefined) semver[2] = -1;
	if (semver[1] === undefined) semver[1] = -1;
	return semver;
}

// [1, 0, 3] == [1, 0, 3] -> true
// [1, 0, 3] == [1, 0, -1] -> true
// [1, 0, 3] == [1, 0, 4] -> false
function CompareSemVer(version: number[], supportedVersions: number[][]) {
	for (const supportedVersion of supportedVersions) {
		let match = true;
		for (let i = 0; i < version.length; i++) {
			if (supportedVersion[i] !== -1 && supportedVersion[i] !== version[i]) {
				match = false;
				break;
			}
		}
		if (match) return true;
	}
	return false;
}

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

const plugins = fs.readdirSync(`${__dirname}/../Plugins`, { withFileTypes: true });
for (const plugin of plugins) {
	if (!plugin.isDirectory()) continue;
	const pluginPath = `${__dirname}/../Plugins/${plugin.name}`;

	try {
		var pluginPackage = require(`${pluginPath}/package.json`) as PluginPackage;
	} catch (e) {
		console.error(`${RED}Failed to load "${plugin.name}" - Missing or malformed package.json file${RESET}`);
		continue;
	}

	const error = VerifyPackageIntegrity(pluginPackage);
	if (error) {
		console.error(`${RED}Failed to load "${pluginPackage.name}" - ${error}${RESET}`);
		continue;
	}

	const versions: number[][] = [];
	for (const version of pluginPackage.supported_versions) {
		if (version === 'X') continue;
		if (!version.match(/^[0-9]+\.[0-9X]+(\.[0-9X]+)?$/)) {
			console.error(`${RED}Failed to load "${pluginPackage.name}" - Invalid version in supported_versions: ${version}${RESET}`);
			continue;
		}
		const semver = ConvertSemVer(version);
		versions.push(semver);
	}

	const packageVersion = ConvertSemVer(PrimaryPackage.version);
	if (!CompareSemVer(packageVersion, versions)) {
		console.error(`${RED}[${pluginPackage.name}] Plugin "${pluginPackage.name}" is not supported by this version of Simplicity${RESET}`);
		console.error(`${RED}[${pluginPackage.name}] Plugin will be allowed to load but may not function correctly${RESET}`);
		console.error(`${RED}[${pluginPackage.name}] Simplicity version: ${PrimaryPackage.version}${RESET}`);
		console.error(`${RED}[${pluginPackage.name}] Supported versions: ${pluginPackage.supported_versions.join(', ')}${RESET}`);
	}

	// list of files that the plugin is trying to override
	// We will check this at the end to prevent conflicts
	const overrideRequests: string[][] = [];

	const pluginFiles = RecursiveReadFolder(pluginPath);
	for (const file of pluginFiles) {
		if (file.endsWith('package.json')) continue;
		if (file.endsWith('PluginManager.js')) continue;
		const relativePath = file.replace(`${__dirname}/../Plugins/${plugin.name}/`, '');
		const originalPath = `${__dirname}/${relativePath}`;
		try {
			const originalFullPath = require.resolve(originalPath);
			const pluginFullPath = require.resolve(file);

			if (originalFullPath === pluginFullPath) continue;

			if (modificationTable.has(originalPath)) {
				console.error(`${RED}[PLUGIN] Conflict detected: "${pluginPackage.name}@${pluginPackage.version}" and "${modificationTable.get(originalPath)}"${RESET}`);
				console.error(`${RED}[PLUGIN] File: ${relativePath}${RESET}`);
				console.error(`${RED}[PLUGIN] Priority: ${modificationTable.get(originalPath)}${RESET}`);
				break;
			}

			overrideRequests.push([originalPath, pluginFullPath]);
		} catch (e) {
			// ignore, file doesn't exist
		}
	}

	for (const [originalPath, pluginFullPath] of overrideRequests) {
		resolutionTable.set(originalPath, pluginFullPath);
		modificationTable.set(originalPath, `${pluginPackage.name}@${pluginPackage.version}`);
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