const Module = require('module');
const fs = require('fs');

const resolutionTable = new Map<string, string>();

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
	const pluginFiles = RecursiveReadFolder(pluginPath);
	for (const file of pluginFiles) {
		const relativePath = file.replace(`${__dirname}/../Plugins/${plugin.name}/`, '');
		const originalPath = `${__dirname}/${relativePath}`;
		try {
			resolutionTable.set(require.resolve(originalPath), require.resolve(file));
		} catch (e) {
			// ignore, file doesn't exist
		}
	}
}