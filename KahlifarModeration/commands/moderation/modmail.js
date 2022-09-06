const { sendInfo } = require('../../helpers/send');
const { banUser, unbanUser } = require('../../helpers/modmail');
const { Client, CommandInteraction } = require("discord.js")
const logger = require("../../handlers/logger");
const data = require(`${process.cwd()}/properties.json`)

module.exports = {
    name: "modmail",
    description: "Use all commands around the Modmail System.",
    userPermissions: ["MANAGE_MESSAGES"],
    type: 'CHAT_INPUT',
    options: [
        {
            name: "ban",
            description: "Ban a user from using the Modmail System.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "The user you want to ban.",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "unban",
            description: "Unban a user from using the Modmail System.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "The user you want to unban.",
                    type: "USER",
                    required: true
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        // try {
            switch (args[0]) {
                case "ban":
                    const bUser = await client.users.fetch(args[1])
                    sendInfo(interaction, await banUser(bUser.id), false, true)
                    break;
                case "unban":
                    const uUser = await client.users.fetch(args[1])
                    sendInfo(interaction, await unbanUser(uUser.id), false, true)
                    break;
                default:
                    sendInfo(interaction, "I cant find running code for this interaction.", true, true);
            }
        // } catch (error) {
        //     logger.error(error);
        // }
    }
}