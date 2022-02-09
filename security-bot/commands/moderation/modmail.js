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
        var amount = args[0]
        if (args[0] === undefined) {
            amount = 100;
        }
        let counter = 0
        interaction.channel.messages.fetch({ limit: amount }).then(messages => {
            messages.forEach(message => {
                counter += 1;
                message.delete()
            })
            sendInfo(interaction, `Deleted ${counter} messages.`, true)
        })
    }
}