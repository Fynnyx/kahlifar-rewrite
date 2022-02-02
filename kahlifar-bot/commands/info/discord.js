const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "discord",
    description: "Zeigt dir alle Commands und Informationen über den Bot.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {       
        let linkMsg = ""
        data.discord.links.map(value => {
            linkMsg += `<${value}>\n`
        }) 
        await interaction.reply({ content:  `**Links zum einladen deiner Freunde:**\n${linkMsg}`})    }
}