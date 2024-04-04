// Modified by TomatoCake from https://github.com/DEVTomatoCake/dashboard/blob/ed1b41c23b1f3857ecc7f08baf098f1f5212bb42/minify.js

const fsPromises = require("node:fs").promises
const path = require("node:path")

const UglifyJS = require("uglify-js")
const CleanCSS = require("clean-css")

const nameCache = {}
const defaultOptions = {
	compress: {
		passes: 5,
		unsafe: true,
		unsafe_Function: true,
		unsafe_math: true,
		unsafe_proto: true,
		unsafe_regexp: true
	}
}

const results = []
const minifyFile = async (pathInput, options = {}) => {
	const filename = pathInput.split("/").pop()
	const content = await fsPromises.readFile(pathInput, "utf8")

	let result = {}
	if (filename.endsWith(".js")) {
		result = UglifyJS.minify({
			[pathInput]: content
		}, {
			sourceMap: {
				root: "https://sh0rt.zip/assets/",
				filename,
				url: filename + ".map"
			},
			warnings: "verbose",
			parse: {
				shebang: false
			},
			toplevel: true,
			nameCache,
			mangle: true,
			...defaultOptions,
			...options
		})

		if (result.error) throw result.error
		if (result.warnings && result.warnings.length > defaultOptions.compress.passes) console.log(pathInput, result.warnings)
	} else if (filename.endsWith(".css")) {
		const clean = new CleanCSS({
			compatibility: {
				colors: {
					hexAlpha: true
				},
				properties: {
					shorterLengthUnits: true,
					urlQuotes: false
				}
			},
			level: {
				2: {
					mergeSemantically: true,
					removeUnusedAtRules: true
				}
			},
			inline: false,
			sourceMap: true,
			...options
		})

		const output = clean.minify(content)
		result = {
			code: output.styles + "\n/*# sourceMappingURL=" + filename + ".map */",
			map: output.sourceMap.toString().replace("$stdin", filename)
		}

		if (output.warnings.length > 0 || output.errors.length > 0) console.log(pathInput, output.warnings, output.errors)
	} else if (filename.endsWith(".json")) {
		result = {
			code: JSON.stringify(JSON.parse(content))
		}
	} else return console.error("Unknown minify file type: " + pathInput)

	if (result.code.length >= content.length) return console.log("No reduction for " + pathInput + " (" + content.length + " -> " + result.code.length + ")")

	await fsPromises.writeFile(pathInput, result.code)
	if (result.map) await fsPromises.writeFile(pathInput + ".map", result.map)

	results.push({
		path: pathInput.slice(2),
		size: content.length,
		compressed: result.code.length,
		"% reduction": parseFloat((100 - (result.code.length / content.length * 100)).toFixed(1))
	})
}

async function main() {
	await fsPromises.rm("./out", { recursive: true })
	const allFiles = await fsPromises.readdir("./src", { withFileTypes: true, recursive: true })
	for (const file of allFiles) {
		const dest = path.join(__dirname, "out", path.normalize(file.path).replace("src", ""), file.name)

		if (file.isDirectory()) await fsPromises.mkdir(dest, { recursive: true })
		else await fsPromises.copyFile(path.join(file.path, file.name), dest)
	}

	await minifyFile("./out/serviceworker.js")
	await minifyFile("./out/assets/script.js")
	await minifyFile("./out/assets/style.css")
	await minifyFile("./out/assets/manifest.json")

	results.push({
		path: "= Total",
		size: results.reduce((acc, cur) => acc + cur.size, 0),
		compressed: results.reduce((acc, cur) => acc + cur.compressed, 0),
		"% reduction": parseFloat((100 - (results.reduce((acc, cur) => acc + cur.compressed, 0) / results.reduce((acc, cur) => acc + cur.size, 0) * 100)).toFixed(1))
	})
	console.table(results.sort((a, b) => a["% reduction"] - b["% reduction"]))
}
main()
