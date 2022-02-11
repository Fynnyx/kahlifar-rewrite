const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)

exports.isOwner = async (member) => {
    if (member.guild.ownerId == member.id) {
        return true;
    } else {
        return false;
    }
}