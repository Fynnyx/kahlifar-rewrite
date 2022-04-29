const { updateChannel } = require("../helpers/statChannel.js");
const client = require("../index.js")
const logger = require("../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    try {
        if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            updateChannel()
        }
    } catch (e) {
        logger.error(e)
    }
});