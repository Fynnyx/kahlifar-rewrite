const { sendInfo } = require('../../helpers/send');
const { banUser, unbanUser } = require('../../helpers/modmail');
const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { readFileSync } = require("fs")
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
        },
        {
            name: "banlist",
            description: "Get the banlist from the modmail system",
            type: "SUB_COMMAND",
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
                case "banlist":
                    const banlist = JSON.parse(readFileSync("./modmail.json", "utf8"))
                    var bannedUserString = ""
                    for (let bannedUser of banlist.banlist) {
                        bannedUserString += `- <@${bannedUser}>,\n`
                    }
                    const banlistEmbed = new MessageEmbed()
                        .setTitle("Modmail Banlist")
                        .setDescription("Listed below are the users which arent alowed to use the modmail.\nUse the `/modmail` commands to ban and unban users.")
                        .setColor(data.helpers.send.colors.info)
                        .addField("Banned Users:", (bannedUserString === "" ? "*No users are banned at the moment*" : bannedUserString))

                    interaction.reply({embeds: [banlistEmbed]})
                    break;
                default:
                    sendInfo(interaction, "I cant find running code for this interaction.", true, true);
            }
        // } catch (error) {
        //     logger.error(error);
        // }
    }
}