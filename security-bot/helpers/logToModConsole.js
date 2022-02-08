const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)



exports.logToModConsole = async (value) => {
    value = value.split("<@")[1].split(">")[0]
    if (value.startsWith("!")) {
        value = value.slice(1)
    }
    return value
}

exports.mailToModMail = async (value) => {

}
