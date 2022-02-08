const { Client, CommandInteraction } = require("discord.js")
const { sendInfo, sendError, sendWarn } = require("../../helpers/send")
const { isOwner } = require("../../helpers/isOwner")
const data = require(`${process.cwd()}/properties.json`)


module.exports = {

    name: "role",
    description: "ADD or REMOVE a role to a user/role members.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_ROLES"],
    rolePermissions: ["814234539773001778"],
    options: [
        {
            name: "type",
            description: "ADD or REMOVE.",
            type: "STRING",
            required: true,
            choices: [
                { name: "ADD", value: "ADD" },
                { name: "REMOVE", value: "REMOVE" }
            ]
        },
        {
            name: "addrole",
            description: "Select the role which should me added.",
            type: "ROLE",
            required: true
        },
        {
            name: "selectusers",
            description: "Select the role which members get the role.",
            type: "ROLE",
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        // console.log(interaction);
        switch (args[0]) {
            case "ADD":
                interaction.deferReply({ ephemeral: true })
                let counter = 0;

                isOwner(interaction.guild, interaction.member).then(async (isOwner) => {
                    console.log(isOwner);
                    if (isOwner) {
                        interaction.guild.roles.cache.get(args[2]).members.map(member => {
                            // console.log(member);
                            member.roles.add(args[1])
                            counter++;
                        })
                    } else {
                        sendWarning(interaction, "I'm not allowed to do this.", true, true)
                    }
                })


                sendInfo(interaction, `Role added to ${counter} members.`, false, false)
                break

            case "REMOVE":
                break

            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
    }
}