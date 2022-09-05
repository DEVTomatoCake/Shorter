/* eslint-disable no-unused-vars */
function setup() {
    var dateElem = document.getElementById("date")
    dateElem.min = new Date().toISOString().slice(0, -8)
    dateElem.value = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, -8)

    const formElem = document.getElementById("createForm")
    formElem.addEventListener("submit", e => {
        e.preventDefault()
        createURL()
    })
}

function createURL() {
    const shorturl = document.getElementById("url").value
    const name = document.getElementById("name").value
    const date = document.getElementById("date").value

    var params = JSON.stringify({url: shorturl, name, date})
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) document.getElementById("response").innerHTML = this.responseText
    }
    xhr.open("POST", "https://api.tomatenkuchen.eu/short", true)
    xhr.setRequestHeader("Content-Type", "application/json")

    xhr.send(params)
}

function copy() {
      navigator.clipboard.writeText(document.getElementById("resulturl").href).catch(err => {
        alert("Link konnte nicht kopiert werden")
        console.error("Link konnte nicht kopiert werden", err)
    })
}