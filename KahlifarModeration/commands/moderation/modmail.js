const { sendInfo } = require('../../helpers/send');
const { Client, CommandInteraction, MessageEmbed } = require("discord.js")

module.exports = {
    name: "modmail",
    description: "Use all commands around the Modmail System.",
    userPermissions: ["MANAGE_MESSAGES"],
    type: 'CHAT_INPUT',
    options: [
        
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        interaction.reply({ content: "Comming soon!!!", ephemeral: true })
    }
}