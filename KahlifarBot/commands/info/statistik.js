const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const logger = require("../../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "statistik",
    description: "Erhalte Informationen wie aktiv unser Discord ist..",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            await interaction.reply({ content: `**Discord Statistiken:**\n<${data.commands.statistik.link}>` })
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}