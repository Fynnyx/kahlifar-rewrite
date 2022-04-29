const { sendInfo } = require('../../helpers/send');
const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const logger = require("../../handlers/logger")
const { sendError } = require("../../helpers/send")

module.exports = {
    name: "clear",
    description: "clear the whole channel or just a specific amount of messages.",
    userPermissions: ["MANAGE_MESSAGES"],
    type: 'CHAT_INPUT',
    options: [
        {
            name: "amount",
            description: "The amount of messages which should be deleted. (Default is 100)",
            type: "INTEGER",
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
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
            }).then(() => {
                sendInfo(interaction, `Deleted ${counter} messages.`, true)
            })
        } catch (error) {
            sendError(interaction, "Something went wrong!", true, false)
            logger.error(error)
        }
    }
}