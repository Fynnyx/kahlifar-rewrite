const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const logger = require(`../../handlers/logger.js`)
const { sendError } = require(`../../helpers/send.js`)

module.exports = {
    name: "ping",
    description: "Replies wit pong and a value",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            await interaction.reply({ content: `${client.ws.ping} ms` })
        } catch (error) {
            sendError(interaction, "Something went wrong!", true, false)
            logger.error(error)
        }
    }
}