const client = require("../index.js")
const { MessageEmbed } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)



exports.logToModConsole = async (title, value, color) => {
    let channel = client.channels.cache.get(data.modconsole)
    let logEmbed = new MessageEmbed()
        .setColor(color)
        .setTitle(title)
        .setDescription(value)
        .setTimestamp()
        .setFooter({ text: "", iconURL: client.user.displayAvatarURL() })

    channel.send({ embeds: [logEmbed]})
}