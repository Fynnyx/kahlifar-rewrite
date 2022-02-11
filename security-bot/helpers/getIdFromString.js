const data = require(`${process.cwd()}/properties.json`)

exports.getIdFromString = (string) => {
    string.split("<@")[1].split(">")[0];
    if (string.startsWith("!")) {
        string = string.slice(1);
    }
    return string;
}
