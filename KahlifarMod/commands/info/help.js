const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
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
        let helpEmbed = new MessageEmbed()
            .setTitle(`Hilfe für den ${client.user.username}`)
            .setDescription(`.\n\n--------------------------------`)
            .setColor("#71368a")
            .setTimestamp()
            .setFooter("By Fynnyx | github.com/Fynnyx")
            
            client.slashCommands.map(value => {
                helpEmbed.addField(value.name, value.description, true)
            })
        
        await interaction.reply({ embeds: [helpEmbed] })    }
}