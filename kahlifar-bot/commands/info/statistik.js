const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
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
        await interaction.reply({ content: `**Discord Statistiken:**\n<${data.commands.statistik.link}>` })
    }
}