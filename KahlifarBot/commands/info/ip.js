const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const logger = require("../../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "ip",
    description: "Zeigt dir alle IP-Adressen für den Minecraft Server.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            const ipEmbed = new MessageEmbed()
                .setTitle(`IP-Adressen für die Server`)
                .setDescription(`--------------------------------`)
                .setColor(data.helpers.send.colors.info)
            data.commands.ip.ips.map(server => {
                let ipString = ""
                for (let ip of server.ips) {
                    ipString += `- ${ip}\n`
                }
                ipEmbed.addField(server.name, ipString, true)
            })
            await interaction.reply({ embeds: [ipEmbed] })
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}