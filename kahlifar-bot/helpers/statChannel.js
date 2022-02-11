const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)

exports.updateChannel = async () => {
    data.helpers.statChannel.channels.map(async (stat) => {
        let channel = await client.channels.fetch(stat.channelId)
        channel.guild.members.fetch().then(async fetchedMembers => {
            var allMembers = fetchedMembers.filter(member => member.roles.cache.has(stat.roleId));
            channel.setName(`${stat.content.replace("%COUNT%", allMembers.size)}`)
        })
    })
}