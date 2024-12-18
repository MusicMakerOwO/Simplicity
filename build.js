// read each of the ts files, every export default needs to include a module.exports as well to make it compatible with require() in CommonJS

console.log('Adjusting exports for CommonJS compatibility...');

const fs = require('node:fs');
const { execSync } = require('node:child_process');

let files = {} // <path/to/file>: <content>

function ReadFolder(dir) {
	fs.readdirSync(dir).forEach(file => {
		const filePath = `${dir}/${file}`;
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			ReadFolder(filePath);
		} else {
			files[filePath] = fs.readFileSync(filePath, 'utf8');
		}
	})
}
ReadFolder(`${__dirname}/src`);

let modified = 0;
for (const file in files) {
	if (!file.endsWith('.ts')) continue;
	const content = files[file];
	if (!content.includes('export default')) continue;
	if (content.includes('export default') && content.includes('module.exports')) continue;
	const newContent = content + '\nmodule.exports = exports.default;';
	fs.writeFileSync(file, newContent);
	modified++;
}

console.log('Checking for compilation error...');
execSync(`tsc -p ${__dirname}/tsconfig.json --noEmit`, { stdio: 'inherit' });

if (fs.existsSync(`${__dirname}/build`)) {
	console.log('Clearing old build...');
	fs.rmSync(`${__dirname}/build`, { recursive: true });
}

console.log('Compiling declarations...');
execSync(`tsc -p ${__dirname}/tsconfig.json --emitDeclarationOnly`, { stdio: 'inherit' });
console.log('Bundling declarations...');
execSync(`npx dts-bundle-generator --project ${__dirname}/tsconfig.json --no-check --out-file ${__dirname}/build/typings.d.ts ${__dirname}/src/index.ts`, { stdio: 'inherit' });

console.log('Clearing excess declarations...');
files = {};
ReadFolder(`${__dirname}/build`);
for (const file in files) {
	if (file.endsWith('.d.ts') && !file.endsWith('typings.d.ts')) {
		fs.rmSync(file);
	}
}

console.log('Compiling to JS...');
execSync(`npx sucrase ${__dirname}/src --out-dir ${__dirname}/build --transforms typescript,imports`, { stdio: 'inherit' });

/*
class Client extends _Events2.default {
	#token;
	
	
	
	 __init() {this.connected_at = null} // set in.wsClientClient
	

	 __init2() {this.user = null}

	
	
	
	
	
	
	
	
	

	 __init3() {this.pressence = 'ONLINE'}
	 __init4() {this.activity = null}
	 */

// remove excessive whitespace

console.log('Cleaning up...');

files = {};
ReadFolder(`${__dirname}/build`);

const topComment = `
///////////////////////////////////////////////////////////////////
// Welcome to the Simplicity source code!						 //
// This code is written in TypeScript and compiled using Sucrase //
// For any issues, please report them on the GitHub repository	 //
// https://github.com/MusicMakerOwO/Simplicity/issues 			 //
///////////////////////////////////////////////////////////////////
`.trim();

for (const file in files) {
	const content = files[file];
	const newContent = content.replace(/(\s*\n){3,}/g, '\n\n');
	fs.writeFileSync(file, topComment + '\n\n' + newContent);
}

console.log('Done!');