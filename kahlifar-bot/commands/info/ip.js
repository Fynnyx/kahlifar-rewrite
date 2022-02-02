const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "ip",
    description: "Zeigt dir alle IP-Adressen für den Minecraft Server.",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {       
        let ips = ""
        data.ip.ips.map(value => {
            ips += `- ${value}\n`
        }) 
        await interaction.reply({ content:  `**Server IP-Adressen:**\n${ips}`})    }
}