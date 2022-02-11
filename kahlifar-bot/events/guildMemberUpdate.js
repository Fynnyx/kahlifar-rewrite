const { updateChannel } = require("../helpers/statChannel.js");
const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        updateChannel()
    }
});