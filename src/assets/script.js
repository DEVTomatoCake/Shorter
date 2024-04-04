const documentCopy = document

const langDE = {
	optionsVal: {
		"15m": "15 Minuten",
		"1h": "1 Stunde",
		"8h": "8 Stunden",
		"1d": "1 Tag",
		"3d": "3 Tage",
		"1w": "1 Woche",
		"2w": "2 Wochen",
		"1mo": "1 Monat",
		"2mo": "2 Monate",
		"3mo": "3 Monate",
		"6mo": "6 Monate",
		"1y": "1 Jahr",
		"3y": "3 Jahre",
		custom: "Benutzerdefiniert"
	},
	response: "Warte auf Eingabe...",
	"header-text": "Short-URL erstellen",
	"target-uri": "Ziel-URI:<span>*</span>:",
	"short-name-label": "Short-Name:",
	lang3: "Ablaufdatum<span>*</span>:",
	submit: "Erstellen",
	langswitch: "English"
}
const langEN = {
	optionsVal: {
		"15m": "15 Minutes",
		"1h": "1 Hour",
		"8h": "8 Hours",
		"1d": "1 Day",
		"3d": "3 Days",
		"1w": "1 Week",
		"2w": "2 Weeks",
		"1mo": "1 Month",
		"2mo": "2 Months",
		"3mo": "3 Months",
		"6mo": "6 Months",
		"1y": "1 Year",
		"3y": "3 Years",
		custom: "Custom"
	},
	response: "Waiting for input...",
	"header-text": "Create a short URL",
	"target-uri": "Target URI:<span>*</span>:",
	"short-name-label": "Short name:",
	lang3: "Expiration date<span>*</span>:",
	submit: "Create",
	langswitch: "Deutsch"
}

const getLang = () => {
	if (localStorage.getItem("lang") == "de") return langDE
	return langEN
}

const setLang = () => {
	const lang = getLang()

	let optionHTML = ""
	const currentSelect = documentCopy.getElementById("date").value
	for (const [key, value] of Object.entries(lang.optionsVal)) {
		optionHTML += "<option value='" + key + "'" + (key == currentSelect ? " selected" : "") + ">" + value + "</option>"
	}
	documentCopy.getElementById("date").innerHTML = optionHTML

	documentCopy.getElementById("response").innerHTML = lang.response
	documentCopy.getElementById("header-text").innerHTML = lang["header-text"]
	documentCopy.getElementById("target-uri").innerHTML = lang["target-uri"]
	documentCopy.getElementById("short-name-label").innerHTML = lang["short-name-label"]
	documentCopy.getElementById("lang3").innerHTML = lang.lang3
	documentCopy.getElementById("submit").innerHTML = lang.submit
	documentCopy.getElementById("langswitch").innerHTML = lang.langswitch
	documentCopy.getElementsByTagName("title")[0].innerText = lang["header-text"]
}

const update = () => {
	const select = documentCopy.getElementById("date")
	switch (select.options[select.selectedIndex].value) {
		case "custom":
			documentCopy.getElementById("date-custom-container").removeAttribute("hidden")
			const dateElem = documentCopy.getElementById("date-custom")
			dateElem.min = dateAdd(new Date(), "minute", 2).toISOString().substring(0, 16)
			dateElem.value = dateAdd(new Date(), "minute", 2).toISOString().substring(0, 16)
			break
		default:
			documentCopy.getElementById("date-custom-container").setAttribute("hidden", "")
	}
}

const changeLang = () => {
	if (localStorage.getItem("lang") == "en") localStorage.setItem("lang", "de")
	else localStorage.setItem("lang", "en")

	setLang()
	update()
}

function setup() {
	const userLang = navigator.language || navigator.userLanguage
	localStorage.setItem("lang", "en")
	if (userLang && userLang.split("-")[0] != "en") changeLang()

	documentCopy.getElementById("createForm").addEventListener("submit", e => {
		e.preventDefault()
		createURL()
	})

	documentCopy.getElementById("langswitch").addEventListener("click", changeLang)
	documentCopy.getElementById("date").addEventListener("change", update)

	if ("serviceWorker" in navigator) navigator.serviceWorker.register("/serviceworker.js")
}
documentCopy.addEventListener("DOMContentLoaded", setup)

const getDate = () => {
	const select = documentCopy.getElementById("date")
	const option = select.options[select.selectedIndex]

	if (option.value == "custom") return documentCopy.getElementById("date-custom").value
	return toDate().toISOString().substring(0, 16)
}

const copy = () =>
	navigator.clipboard.writeText(documentCopy.getElementById("resulturl").href).catch(err => {
		if (localStorage.getItem("lang") == "de") alert("Link konnte nicht kopiert werden")
		else alert("Link could not be copied")
		console.error("Link could not be copied", err)
	})

async function createURL() {
	const shorturl = documentCopy.getElementById("url").value
	const name = documentCopy.getElementById("name").value

	const response = documentCopy.getElementById("response")
	if (!shorturl) {
		if (localStorage.getItem("lang") == "de") return response.innerHTML = "Bitte gib eine URL an!"
		else return response.innerHTML = "Please enter a URL!"
	}
	if (!shorturl.startsWith("https://") && !shorturl.startsWith("http://")) {
		if (localStorage.getItem("lang") == "de") return response.innerHTML = "Bitte gib eine gültige URL an!"
		else return response.innerHTML = "Please enter a valid URL!"
	}

	const res = await fetch(location.protocol == "https:" ? location.origin : "https://sh0rt.zip", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify({
			url: shorturl,
			name,
			date: getDate()
		})
	})
	const json = await res.json()
	console.log("Response received", json)

	if (json.name) {
		const url = (location.protocol == "https:" ? location.origin : "https://sh0rt.zip") + "/" + json.name

		if (localStorage.getItem("lang") == "de") response.innerHTML =
			"Der Link wurde erfolgreich unter <a href='" + url + "' id='resulturl'>" + url + "</a> erstellt<br><button id='copy-button'>Kopieren</button>"
		else response.innerHTML =
			"The link was successfully created at <a href='" + url + "' id='resulturl'>" + url + "</a><br><button id='copy-button'>Copy</button>"
		documentCopy.getElementById("copy-button").addEventListener("click", copy)

		const qr = qrcode(4, "L")
		qr.addData(url)
		qr.make()
		documentCopy.getElementById("qrimage-container").innerHTML = qr.createImgTag(7, 10, "QR code generated for the short URL")

		try {
			navigator.clipboard.writeText(url)
		} catch (e) {
			console.error("Link could not be copied to clipboard automatically", e)
		}
	} else {
		switch (json.error) {
			case "missingurlbody":
				if (localStorage.getItem("lang") == "de") response.innerHTML = "Bitte gib eine URL an"
				else response.innerHTML = "Please enter a URL"
				break
			case "url_invalid":
				if (localStorage.getItem("lang") == "de") response.innerHTML = "Bitte gib eine gültige URL an"
				else response.innerHTML = "Please enter a valid URL"
				break
			case "name_blacklisted":
				if (localStorage.getItem("lang") == "de") response.innerHTML = "Dieser Short-Name ist nicht erlaubt"
				else response.innerHTML = "This short name is not allowed"
				break
			case "name_alreadyexists":
				if (localStorage.getItem("lang") == "de") response.innerHTML = "Der Name ist bereits vergeben"
				else response.innerHTML = "The name is already taken"
				break
			default:
				if (localStorage.getItem("lang") == "de") response.innerHTML = "Ein unbekannter Fehler ist aufgetreten: " + json.error
				else response.innerHTML = "An unknown error occurred: " + json.error
		}
	}
}

function dateAdd(date, interval, units) {
	if (!(date instanceof Date)) return void 0
	let ret = new Date(date)
	const checkRollover = () => {
		if (ret.getDate() != date.getDate()) ret.setDate(0)
	}

	switch (String(interval).toLowerCase()) {
		case "year":
			ret.setFullYear(ret.getFullYear() + units)
			checkRollover()
			break
		case "quarter":
			ret.setMonth(ret.getMonth() + 3 * units)
			checkRollover()
			break
		case "month":
			ret.setMonth(ret.getMonth() + units)
			checkRollover()
			break
		case "week":
			ret.setDate(ret.getDate() + 7 * units)
			break
		case "day":
			ret.setDate(ret.getDate() + units)
			break
		case "hour":
			ret.setTime(ret.getTime() + units * 1000 * 60 * 60)
			break
		case "minute":
			ret.setTime(ret.getTime() + units * 1000 * 60)
			break
		case "second":
			ret.setTime(ret.getTime() + units * 1000)
			break
		default:
			ret = null
	}
	return ret
}

function toDate() {
	const select = documentCopy.getElementById("date")
	const option = select.options[select.selectedIndex].value
	const date = new Date()

	if (option == "15m") return dateAdd(date, "minute", 15)
	if (option == "1h") return dateAdd(date , "hour", 1)
	if (option == "8h") return dateAdd(date, "hour", 8)
	if (option == "1d") return dateAdd(date, "day", 1)
	if (option == "3d") return dateAdd(date, "day", 3)
	if (option == "1w") return dateAdd(date, "week", 1)
	if (option == "2w") return dateAdd(date, "week", 2)
	if (option == "1mo") return dateAdd(date, "month", 1)
	if (option == "3mo") return dateAdd(date, "month", 3)
	if (option == "6mo") return dateAdd(date, "month", 6)
	if (option == "1y") return dateAdd(date, "year", 1)
	if (option == "3y") return dateAdd(date, "year", 3)
}
