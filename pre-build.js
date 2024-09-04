// read each of the ts files, every export default needs to include a module.exports as well to make it compatible with require() in CommonJS

const fs = require('fs');

const files = {} // <path/to/file>: <content>

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

console.log(`Read ${Object.keys(files).length} files, modified ${modified} files`);