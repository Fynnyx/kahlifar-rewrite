const data = require(`${process.cwd()}/properties.json`)

exports.getIdFromString = (string) => {
    string = string.split("<@")[1]
    string = string.split(">")[0];
    if (string.startsWith("!")) {
        string = string.slice(1);
    }
    return string;
}
