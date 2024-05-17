import { getAssetFromKV } from "@cloudflare/kv-asset-handler"
import manifestJSON from "__STATIC_CONTENT_MANIFEST"
const assetManifest = JSON.parse(manifestJSON)

import { Buffer } from "node:buffer"
import qrCode from "./src/assets/qrcode.min.js"

const optionsKV = {
	cacheTtl: 60 * 2.5
}

const urlsESLint = {
	angular: "https://github.com/EmmanuelDemey/eslint-plugin-angular/blob/master/docs/rules/{RULE}.md",
	ava: "https://github.com/avajs/eslint-plugin-ava/blob/main/docs/rules/{RULE}.md",
	cypress: "https://github.com/cypress-io/eslint-plugin-cypress/blob/master/docs/rules/{RULE}.md",
	es: "https://eslint-plugin-es.mysticatea.dev/rules/{RULE}.html",
	eslint: "https://eslint.org/docs/rules/{RULE}",
	stylistic: "https://eslint.style/rules/default/{RULE}",
	stylisticjs: "https://eslint.style/rules/js/{RULE}",
	stylisticts: "https://eslint.style/rules/ts/{RULE}",
	"eslint-comments": "https://github.com/mysticatea/eslint-plugin-eslint-comments/blob/master/docs/rules/{RULE}.md",
	"eslint-plugin": "https://github.com/eslint-community/eslint-plugin-eslint-plugin/blob/main/docs/rules/{RULE}.md",
	typescript: "https://typescript-eslint.io/rules/{RULE}",
	security: "https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/{RULE}.md",
	node: "https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/{RULE}.md",
	jest: "https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/{RULE}.md",
	stylelint: "https://stylelint.io/user-guide/rules/{RULE}",
	react: "https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/{RULE}.md",
	import: "https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/{RULE}.md",
	jasmine: "https://github.com/tlvince/eslint-plugin-jasmine/blob/master/docs/rules/{RULE}.md",
	mocha: "https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/{RULE}.md",
	svelte: "https://github.com/sveltejs/eslint-plugin-svelte/blob/main/docs/rules/{RULE}.md",
	"redux-saga": "https://github.com/pke/eslint-plugin-redux-saga/blob/master/docs/rules/{RULE}.md",
	"jsx-a11y": "https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/{RULE}.md",
	lodash: "https://github.com/wix-incubator/eslint-plugin-lodash/blob/master/docs/rules/{RULE}.md",
	"testing-library": "https://github.com/testing-library/eslint-plugin-testing-library/blob/main/docs/rules/{RULE}.md",
	html: "https://github.com/BenoitZugmeyer/eslint-plugin-html#html{RULE}",
	promise: "https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/{RULE}.md",
	nuxt: "https://github.com/nuxt/eslint-plugin-nuxt/blob/master/docs/rules/{RULE}.md",
	"vue-a11y": "https://github.com/maranran/eslint-plugin-vue-a11y/blob/master/docs/rules/{RULE}.md",
	fp: "https://github.com/jfmengels/eslint-plugin-fp/blob/master/docs/rules/{RULE}.md",
	lit: "https://github.com/43081j/eslint-plugin-lit/blob/master/docs/rules/{RULE}.md",
	jquery: "https://github.com/dgraham/eslint-plugin-jquery/blob/master/rules/{RULE}.js",
	sonarjs: "https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/{RULE}.md",
	unicorn: "https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/{RULE}.md",
	ember: "https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/{RULE}.md",
	"react-native": "https://github.com/Intellicode/eslint-plugin-react-native/blob/master/docs/rules/{RULE}.md",
	jsonc: "https://ota-meshi.github.io/eslint-plugin-jsonc/rules/{RULE}.html",
	flowtype: "https://github.com/gajus/eslint-plugin-flowtype/blob/master/README.md#eslint-plugin-flowtype-rules-{RULE}",
	vue: "https://eslint.vuejs.org/rules/{RULE}.html",
	wc: "https://github.com/43081j/eslint-plugin-wc/blob/master/docs/rules/{RULE}.md",
	xss: "https://github.com/Rantanen/eslint-plugin-xss/blob/master/docs/rules/{RULE}.md",
	yml: "https://ota-meshi.github.io/eslint-plugin-yml/rules/{RULE}.html"
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Access-Control-Max-Age": 7200
}
const corsJSONHeaders = {
	"Content-Type": "application/json",
	...corsHeaders
}

const storageDuration = size => {
	if (size > 1024 * 1024 * 3) return 60 * 60 * 24 * 2
	if (size > 1024 * 1024) return 60 * 60 * 24 * 7
	if (size > 1024 * 256) return 60 * 60 * 24 * 14
	return 60 * 60 * 24 * 30
}

const blacklistedPaths = new Set([
	"api",
	"qr",
	"file",
	"report",
	"assets",
	"index.html",
	"robots.txt",
	"favicon.ico",
	"serviceworker.js",
	"serviceworker.js.map",
	".well-known",
	".", // https://developers.cloudflare.com/kv/api/write-key-value-pairs/#:~:text=have%20a,or%20..
	"..",
	"about",
	"info",
	"localhost",
	"localdomain",
	"broadcasthost",
	"www",
	"wpad",
	"isatap",
	"imap",
	"pop",
	"pop3",
	"smtp",
	"mail",
	"admin",
	Object.keys(urlsESLint)
])
const blacklistedUsernames = new Set([
	...blacklistedPaths,
	"administrator",
	"webmaster",
	"hostmaster",
	"root",
	"ssladmin",
	"ssladministrator",
	"sysadmin",
	"support",
	"abuse",
	"security",
	"noreply",
	"no-reply"
])

const socialEmbed =
	"<meta property='og:title' content='Short-URL'>" +
	"<meta property='og:type' name='og:type' content='shorter'>" +
	"<meta property='og:image' content='https://sh0rt.zip/assets/screen.webp'>" +
	"<meta data-react-helmet='true' property='twitter:image' name='twitter:image' content='https://sh0rt.zip/assets/screen.webp'>" +
	"<meta data-react-helmet='true' property='og:image' name='og:image' content='https://sh0rt.zip/assets/screen.webp'>"

export default {
	async fetch(request, env, ctx) {
		let path = decodeURI((new URL(request.url)).pathname)
		if (request.method == "GET") {
			if (path == "/" || path == "/index.html" || path == "/favicon.ico" || path == "/serviceworker.js" || path == "/robots.txt" || path.startsWith("/assets/")) return await getAssetFromKV(
				{
					request,
					waitUntil: ctx.waitUntil.bind(ctx)
				},{
					ASSET_NAMESPACE: env.__STATIC_CONTENT,
					ASSET_MANIFEST: assetManifest
				}
			)

			let target = "redirect"
			if (path.startsWith("/api/")) {
				target = "api"
				path = path.replace("/api", "")
			} else if (path.startsWith("/qr/")) {
				target = "qr"
				path = path.replace("/qr", "")
			} else if (request.headers.get("User-Agent").includes("Discordbot")) target = "embed"

			const isESLint = path.split("/").length > 1 && urlsESLint[path.split("/")[1].toLowerCase()]
			const url = isESLint ? urlsESLint[path.split("/")[1].toLowerCase()].replace("{RULE}", path.split("/").slice(2).join("/"))
				: (
					path.startsWith("/file/")
					? await env.SHORTER_URLS.get("file/" + path.split("/")[2].toLowerCase() + "/" + path.split("/")[3], {...optionsKV, type: "arrayBuffer"})
					: await env.SHORTER_URLS.get(path.split("/")[1].toLowerCase(), optionsKV)
				)

			if (!url && target == "embed")
				return new Response(socialEmbed + "<meta property='og:url' content='https://sh0rt.zip'><meta property='og:description' content='Unknown Short-URL'><meta name='theme-color' content='#FF0000'>", {
					headers: {
						"Content-Type": "text/html"
					}
				})
			if (!url) return new Response("Unknown short URL", { status: 404 })

			let redirect = url + (isESLint ? "" : path.split("/").slice(2).join("/"))
			if (request.url.includes("?")) {
				const params = request.url.split("?")[1]
				redirect += (url.includes("?") ? "&" : "?") + params
			}

			if (target == "redirect") {
				if (path.startsWith("/file/"))
					return new Response(url, {
						headers: {
							"Content-Type": "application/octet-stream",
							"Content-Disposition": "attachment; filename=" + path.split("/")[3]
						}
					})
				return Response.redirect(redirect, 302)
			}
			if (target == "api") return new Response(JSON.stringify({url: redirect}), {
				headers: corsJSONHeaders
			})
			if (target == "qr") {
				const qr = qrCode(4, "L")
				qr.addData("https://sh0rt.zip/" + path.split("/")[1].toLowerCase())
				qr.make()
				const decodedData = Buffer.from(qr.createDataURL(4, 0).split(",")[1], "base64")

				// Overwrite the Content-Length header because Cloudflare somehow messes it up
				const { writable, readable } = new FixedLengthStream(decodedData.length)
				const writer = writable.getWriter()

				writer.write(decodedData)
				writer.close()

				return new Response(readable, {
					headers: {
						"Content-Type": "image/gif",
						...corsHeaders
					}
				})
			}
			return new Response(socialEmbed + "<meta property='og:description' content='" + redirect + "'><meta name='theme-color' content='#33FF33'>", {
				headers: {
					"Content-Type": "text/html"
				}
			})
		} else if (request.method == "POST") {
			const body = await request.text()
			try {
				const parsed = JSON.parse(body)
				if (!parsed.url && (!parsed.files || parsed.files.length == 0)) return new Response(JSON.stringify({error: "missingurlbody"}), {
					status: 400,
					headers: corsJSONHeaders
				})
				if (parsed.url && typeof parsed.url != "string")
					return new Response(JSON.stringify({error: "url_invalid"}), {
						status: 422,
						headers: corsJSONHeaders
					})
				if (parsed.name && typeof parsed.name != "string")
					return new Response(JSON.stringify({error: "name_invalid"}), {
						status: 422,
						headers: corsJSONHeaders
					})
				if (parsed.url && (parsed.url.includes("://sh0rt.zip") || !new RegExp(/^https?:\/\/(([-a-z0-9]+\.)+)?[-a-z0-9]+\.[a-z0-9]+/i).test(parsed.url)))
					return new Response(JSON.stringify({error: "url_invalid"}), {
						status: 422,
						headers: corsJSONHeaders
					})

				let name = ""
				if (parsed.name) {
					name = parsed.name
					if (name.startsWith("/")) name = name.slice(1)
					if (name.startsWith("/") || name.length > 512) return new Response(JSON.stringify({error: "name_invalid"}), {
						status: 422,
						headers: corsJSONHeaders
					})

					if (blacklistedPaths.has(name.split("/")[0].trim().toLowerCase())) return new Response(JSON.stringify({error: "name_blacklisted"}), {
						status: 422,
						headers: corsJSONHeaders
					})

					if (await env.SHORTER_URLS.get(name.toLowerCase(), optionsKV)) return new Response(JSON.stringify({error: "name_alreadyexists"}), {
						status: 409,
						headers: corsJSONHeaders
					})
				} else {
					name = Math.random().toString(36).slice(9)
					while (await env.SHORTER_URLS.get(name, optionsKV)) name = Math.random().toString(36).slice(8)
				}

				name = name.toLowerCase()
				const date = parsed.date ? new Date(parsed.date).getTime() : Date.now() + 1000 * 60 * 60 * 24 * 5
				if (parsed.url) await env.SHORTER_URLS.put(name, parsed.url, {
					expiration: date / 1000,
					metadata: {
						created: Date.now()
					}
				})

				const fileStatus = []
				if (parsed.files && Array.isArray(parsed.files)) {
					if (parsed.files.reduce((acc, file) => acc + file.content.length, 0) > 1024 * 1024 * 15) return new Response(JSON.stringify({error: "files_too_large", limit: 1024 * 1024 * 15}), {
						status: 413,
						headers: corsJSONHeaders
					})

					for await (const file of parsed.files) {
						if (file.content.length > 1024 * 1024 * 5) return new Response(JSON.stringify({error: "file_too_large", limit: 1024 * 1024 * 5}), {
							status: 413,
							headers: corsJSONHeaders
						})

						const fileName = file.name ? file.name.trim().slice(-512).replace(/[^\w-.,]/g, "") : Math.random().toString(36).slice(8)
						if (fileStatus.some(f => f.name == fileName)) continue

						const expires = Math.round(Math.min(date / 1000, (Date.now() / 1000) + storageDuration(file.content.length)))
						fileStatus.push({
							uri: "https://sh0rt.zip/file/" + name + "/" + fileName,
							name: fileName,
							expires
						})

						await env.SHORTER_URLS.put("file/" + name + "/" + fileName, Uint8Array.from(Buffer.from(file.content.split(",")[1], "base64")), {
							expiration: expires,
							metadata: {
								created: Date.now()
							}
						})
					}
				}

				return new Response(JSON.stringify({
					uri: parsed.url ? "https://sh0rt.zip/" + name : void 0,
					name,
					files: fileStatus.length > 0 ? fileStatus : void 0
				}), {
					status: 201,
					headers: corsJSONHeaders
				})
			} catch (e) {
				console.error(e, body)
				return new Response("Received invalid JSON, or another error occured: " + e, { status: 400 })
			}
		} else if (request.method == "OPTIONS") {
			return new Response("", {
				status: 204,
				headers: corsHeaders
			})
		} else return new Response("Unsupported method", { status: 405 })
	}
}
