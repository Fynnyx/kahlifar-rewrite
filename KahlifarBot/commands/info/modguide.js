const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const {getEmbedFromJSON} = require(`../../helpers/getFromJSON.js`)
const logger = require(`../../handlers/logger.js`)
const { sendError } = require(`../../helpers/send.js`)

module.exports = {
    name: "modguide",
    description: "Get a guide to be a Moderator",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            const modguideEmbed = await getEmbedFromJSON(`${process.cwd()}/assets/embeds/modguide.json`)
            await interaction.reply({ embeds: [modguideEmbed], ephemeral: true })
        } catch (error) {
            sendError(interaction, "Something went wrong!", false, true)
            logger.error(error)
        }
    }
}