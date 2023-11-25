function setup() {
	const formElem = document.getElementById("createForm")

	const userLang = navigator.language || navigator.userLanguage
	sessionStorage.setItem("lang", "de")
	if (userLang && userLang.split("-")[0] != "de") changeLang()

	formElem.addEventListener("submit", e => {
		e.preventDefault()
		createURL()
	})
}

async function createURL() {
	const shorturl = document.getElementById("url").value
	const name = document.getElementById("name").value
	const date = getDate()
	if (!shorturl) {
		if (sessionStorage.getItem("lang") == "de") return document.getElementById("response").innerHTML = "Bitte gib eine URL an!"
		else return document.getElementById("response").innerHTML = "Please enter a URL!"
	}
	if (!shorturl.startsWith("https://") && !shorturl.startsWith("http://")) {
		if (sessionStorage.getItem("lang") == "de") return document.getElementById("response").innerHTML = "Bitte gib eine gültige URL an!"
		else return document.getElementById("response").innerHTML = "Please enter a valid URL!"
	}

	fetch(location.href, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({url: shorturl, name, date})
	})
	.then(res => res.json())
	.then(data => {
		console.log("Response received", data)
		if (data.name) {
			if (sessionStorage.getItem("lang") == "de") document.getElementById("response").innerHTML =
				"Der Link wurde erfolgreich unter <a href='https://shorter.cf/" + data.name + "' id='resulturl'>https://shorter.cf/" + data.name + "</a> erstellt <button onclick='copy()'>Kopieren</button>"
			else document.getElementById("response").innerHTML =
				"The link was successfully created at <a href='https://shorter.cf/" + data.name + "' id='resulturl'>https://shorter.cf/" + data.name + "</a> <button onclick='copy()'>Copy</button>"
			document.getElementById("qrimage").src = "https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fshorter.cf%2F" + encodeURIComponent(data.name) + "&size=150x150&qzone=2"
			document.getElementById("qrimage").style.display = "block"
		} else {
			switch (data.error) {
				case "missingurlbody":
					if (sessionStorage.getItem("lang") == "de") document.getElementById("response").innerHTML = "Bitte gib eine URL an"
					else document.getElementById("response").innerHTML = "Please enter a URL"
					break
				case "url_invalid":
					if (sessionStorage.getItem("lang") == "de") document.getElementById("response").innerHTML = "Bitte gib eine gültige URL an"
					else document.getElementById("response").innerHTML = "Please enter a valid URL"
					break
				case "name_alreadyexists":
					if (sessionStorage.getItem("lang") == "de") document.getElementById("response").innerHTML = "Der Name ist bereits vergeben"
					else document.getElementById("response").innerHTML = "The name is already taken"
					break
				default:
					if (sessionStorage.getItem("lang") == "de") document.getElementById("response").innerHTML = "Ein unbekannter Fehler ist aufgetreten"
					else document.getElementById("response").innerHTML = "An unknown error occurred"
			}
		}
	})
}

function copy() {
	navigator.clipboard.writeText(document.getElementById("resulturl").href).catch(err => {
		if (sessionStorage.getItem("lang") == "de") alert("Link konnte nicht kopiert werden")
		else alert("Link could not be copied")
		console.error("Link could not be copied", err)
	})
}

function update() {
	let select = document.getElementById("date")
	let option = select.options[select.selectedIndex]
	switch (option.value) {
		case "custom":
			document.getElementById("date_userdef").type = "datetime-local"
			const dateElem = document.getElementById("date_userdef")
			dateElem.min = dateAdd(new Date(), "minute", 2).toISOString().slice(0, -8)
			dateElem.value = dateAdd(new Date(), "minute", 2).toISOString().slice(0, -8)
			break
		default:
			document.getElementById("date_userdef").type = "hidden"
			break
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
			ret.setTime(ret.getTime() + units * 3600000)
			break
		case "minute":
			ret.setTime(ret.getTime() + units * 60000)
			break
		case "second":
			ret.setTime(ret.getTime() + units * 1000)
			break
		default:
			ret = null
	}
	return ret
}

function getDate() {
	let select = document.getElementById("date")
	let option = select.options[select.selectedIndex]

	if (option.value == "custom") return document.getElementById("date_userdef").value
	return toDate().toISOString().slice(0, -8)
}

function toDate() {
	let select = document.getElementById("date")
	let option = select.options[select.selectedIndex]
	let date = new Date()

	if (option.value == "15m") return dateAdd(date, "minute", 15)
	if (option.value == "1h") return dateAdd(date , "hour", 1)
	if (option.value == "8h") return dateAdd(date, "hour", 8)
	if (option.value == "1d") return dateAdd(date, "day", 1)
	if (option.value == "3d") return dateAdd(date, "day", 3)
	if (option.value == "1w") return dateAdd(date, "week", 1)
	if (option.value == "2w") return dateAdd(date, "week", 2)
	if (option.value == "1mo") return dateAdd(date, "month", 1)
	if (option.value == "3mo") return dateAdd(date, "month", 3)
	if (option.value == "6mo") return dateAdd(date, "month", 6)
	if (option.value == "1y") return dateAdd(date, "year", 1)
}

const langde = {
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
		custom: "Benutzerdefiniert"
	},
	response: "Warte auf Eingabe...",
	lang1: "Short-URL erstellen",
	lang2: "Short-Name:",
	lang3: "Ablaufdatum<span>*</span>:",
	submit: "Erstellen",
	langswitch: "English"
}
const langen = {
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
		custom: "Custom"
	},
	response: "Waiting for input...",
	lang1: "Create a short URL",
	lang2: "Short name:",
	lang3: "Expiration date<span>*</span>:",
	submit: "Create",
	langswitch: "Deutsch"
}

function getLang() {
	if (sessionStorage.getItem("lang") == "de") return langde
	else return langen
}

function setLang() {
	let lang = getLang()
	for (const [key, value] of Object.entries(lang.optionsVal)) {
		const options = document.getElementById("date").options
		options.namedItem(key).text = value
	}
	document.getElementById("response").innerHTML = lang.response
	document.getElementById("lang1").innerHTML = lang.lang1
	document.getElementById("lang2").innerHTML = lang.lang2
	document.getElementById("lang3").innerHTML = lang.lang3
	document.getElementById("submit").innerHTML = lang.submit
	document.getElementById("langswitch").innerHTML = lang.langswitch
	document.getElementsByTagName("title")[0].innerText = lang.lang1
}

function changeLang() {
	if (sessionStorage.getItem("lang") == "de") sessionStorage.setItem("lang", "en")
	else sessionStorage.setItem("lang", "de")
	setLang()
	update()
}
