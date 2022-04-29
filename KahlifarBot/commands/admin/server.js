const { ButtonComponent } = require("@discordjs/builders")
const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const logger = require("../../handlers/logger")
const { sendError } = require("../../helpers/send")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "server",
    description: "Zeigt dir alle Commands und Informationen über den Bot.",
    userPermissions: ["ADMINISTRATOR"],
    type: 'CHAT_INPUT',

    options: [
        {
            name: "admin",
            description: "Verwalte den Server über Discord.",
            type: "SUB_COMMAND"
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            let serverEmbed = new MessageEmbed()
                .setTitle("Admin Server Verwaltung")
                .setDescription("Hier kannst du den Server verwalten.\n**Starten**, **Stoppen** oder **Neustarten**.")
                .setColor("#a2d1c2")

            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("server-start")
                        .setLabel("(Neu)Starten")
                        .setStyle("SUCCESS"),
                    new MessageButton()
                        .setCustomId("server-stop")
                        .setLabel("Stoppen")
                        .setStyle("DANGER")
                )
            await interaction.reply({ embeds: [serverEmbed], components: [row], ephemeral: true })
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}