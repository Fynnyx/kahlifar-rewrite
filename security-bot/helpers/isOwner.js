const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)

exports.isOwner = async (guild, member) => {
    if (guild.ownerId == member.id) return true;
    return false;
}