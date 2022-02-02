const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { writeFile } = require("fs")
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "ping",
    description: "Replies wit pong and a value",
    type: 'CHAT_INPUT',

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.reply({ content: `${client.ws.ping} ms` })    }
}