const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const logger = require(`../../handlers/logger.js`)
const { sendError } = require(`../../helpers/send.js`)
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "help",
    description: "Zeigt dir alle Commands und Informationen über den Bot.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            let helpEmbed = new MessageEmbed()
                .setTitle(`Hilfe für den ${client.user.username}`)
                .setDescription(`Erleichtert das Moderieren und bietet einfach Tools für die Owner und die Moderatoren.\n\n--------------------------------`)
                .setColor("#01253D")
                .setTimestamp()
                .setFooter({ text: "By Fynnyx | github.com/Fynnyx" })

            client.slashCommands.map(value => {
                helpEmbed.addField(value.name, value.description, true)
            })

            await interaction.reply({ embeds: [helpEmbed] })
        } catch (error) {
            console.log(error)
        }
    }
}