const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const logger = require("../../handlers/logger")

module.exports = {
    name: "ping",
    description: "Zeigt dir die Latenz des Bots an",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            await interaction.reply({ content: `${client.ws.ping} ms` })    
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }   
}