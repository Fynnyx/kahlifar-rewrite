const { sendError, sendSuccess } = require("./send.js")
const { sleep } = require("./sleep.js")
const data = require(`${process.cwd()}/properties.json`)

exports.verifyMember = async (interaction) => {
    if (interaction.member.roles.cache.some(r => r.id === data.events.verify.memberrole)) return sendError(interaction, "You are already verified.", true, true);
    data.events.verify.addRoles.forEach(async (role) => {
        interaction.member.roles.add(interaction.guild.roles.cache.get(role))
    })
    sendSuccess(interaction, data.events.verify.verifiedmsg, true, true)
    await sleep(3)
    interaction.member.roles.remove(interaction.guild.roles.cache.get(data.events.verify.basicrole))
}