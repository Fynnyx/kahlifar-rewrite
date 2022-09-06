const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const logger = require("../../handlers/logger")
const { getEmbedFromJSON } = require("../../helpers/getFromJSON")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "socials",
    description: "Listet alle Sozialen Median auf.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            const socialsEmbed = await getEmbedFromJSON(`${process.cwd()}/assets/embeds/social_media.json`)
            await interaction.channel.send({ embeds: [socialsEmbed] })
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}