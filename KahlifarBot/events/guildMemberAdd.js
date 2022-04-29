const { readFileSync } = require('fs');

const client = require("../index.js")
const logger = require("../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)

client.on('guildMemberAdd', async (member) => {
    try {
        if (member.user.bot === false) {
            let wchannel = client.channels.cache.get(data.events.join.channel)
            let message = readFileSync(`${process.cwd()}/assets/texts/userWelcome.txt`, "utf-8")

            wchannel.send(message.replace("%MEMBER%", member))
            data.events.join.roles.map((role) => {
                let guildRole = member.guild.roles.cache.get(role)
                member.roles.add(guildRole)
            })
        } else {
            data.events.join.botRoles.map((role) => {
                let guildRole = member.guild.roles.cache.get(role)
                member.roles.add(guildRole)
            })
        }
    } catch (e) {
        logger.error(e)
    }
});