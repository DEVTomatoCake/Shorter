/* eslint-disable no-unused-vars */
function setup() {
    const formElem = document.getElementById("createForm")
    formElem.addEventListener("submit", e => {
        e.preventDefault()
        createURL()
    })
}

function createURL() {
    const shorturl = document.getElementById("url").value
    const name = document.getElementById("name").value
    const date = getDate()
    if(!shorturl){
        document.getElementById("response").innerHTML = "Bitte gib eine URL an"
        return
    }
    if(!shorturl.startsWith("https://") && !shorturl.startsWith("http://")){
        document.getElementById("response").innerHTML = "Bitte gib eine gültige URL an"
        return
    }
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

function update(){
    let select = document.getElementById('date');
	let option = select.options[select.selectedIndex];
    switch (option.value) {
        case "userdef": document.getElementById("date_userdef").type = "datetime-local"; 
            var dateElem = document.getElementById("date_userdef")
            dateElem.min = dateAdd(new Date, "minute", 2).toISOString().slice(0, -8)
            dateElem.value = dateAdd(new Date, "minute", 2).toISOString().slice(0, -8)
            break;
        default: document.getElementById("date_userdef").type = "hidden"; 
            break;
    }
}

function dateAdd(date, interval, units) {
    if(!(date instanceof Date))
      return undefined;
    var ret = new Date(date);
    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(String(interval).toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return ret;
}

function getDate(){
    let select = document.getElementById('date');
    let option = select.options[select.selectedIndex];
    switch (option.value) {
        case "userdef": return document.getElementById("date_userdef").value;
        default: return toDate(option.value).toISOString().slice(0, -8);
    }
}

function toDate(value){
    let select = document.getElementById('date');
    let option = select.options[select.selectedIndex];
    let date = new Date()
    switch (option.value) {
        case "15m": return dateAdd(date, "minute", 15);
        case "1h": return dateAdd(date , "hour", 1);
        case "8h": return dateAdd(date, "hour", 8);
        case "1d": return dateAdd(date, "day", 1);
        case "3d": return dateAdd(date, "day", 3);
        case "1w": return dateAdd(date, "week", 1);
        case "2w": return dateAdd(date, "week", 2);
        case "1mo": return dateAdd(date, "month", 1);
        case "3mo": return dateAdd(date, "month", 3);
        case "6mo": return dateAdd(date, "month", 6);
        case "1y":  return dateAdd(date, "year", 1);
    }
}