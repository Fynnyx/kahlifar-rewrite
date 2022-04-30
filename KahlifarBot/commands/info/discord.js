const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const logger = require("../../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "discord",
    description: "Kriege den Invite-Link zu diesem Discord.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            let linkMsg = ""
            data.commands.discord.links.map(value => {
                linkMsg += `<${value}>\n`
            })
            await interaction.reply({ content: `**Links zum einladen deiner Freunde:**\n${linkMsg}` })
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}