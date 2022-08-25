const { Client, CommandInteraction, DiscordAPIError } = require("discord.js")
const { sendInfo, sendError, sendWarn } = require("../../helpers/send")
const { isOwner } = require("../../helpers/isOwner")
const { sleep } = require("../../helpers/sleep")
const data = require(`${process.cwd()}/properties.json`)
const logger = require("../../handlers/logger")

const options = [
    {
        name: "role",
        description: "Select the role which should me added/removed.",
        type: "ROLE",
        required: true
    },
    {
        name: "memberrole",
        description: "Select the role which members get the role.",
        type: "ROLE",
        required: true
    }
]


module.exports = {

    name: "role",
    description: "ADD or REMOVE a role to a user/role members.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "add",
            description: "add a role to members with a specified role.",
            type: "SUB_COMMAND",
            options: options
        },
        {
            name: "remove",
            description: "add a role to members with a specified role.",
            type: "SUB_COMMAND",
            options: options
        }

    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            switch (args[0]) {
                case "add":
                    await interaction.reply(`Startet adding <@&${args[1]}> to all members of <@&${args[2]}>`);
                    var counter = 0;

                    interaction.guild.members.fetch().then(fetchedMembers => {
                        var allMembers = fetchedMembers.filter(member => member.roles.cache.has(args[2]));
                        allMembers = allMembers.filter(member => !member.roles.cache.has(args[1]));
                        allMembers.forEach(async member => {
                            if (await isOwner(member) == false) {
                                try {
                                    counter++;
                                    await member.roles.add(member.guild.roles.cache.get(args[1]));
                                    await sleep(0.5);
                                } catch (error) {
                                    if (error instanceof DiscordAPIError) {
                                        if (error.code == 50013) {
                                            sendWarn(interaction, `I don't have the permission to add roles to ${member.user.tag}`);
                                            interaction.editReply(`Tried to add <@&${args[1]}> to ${counter} members.`)
                                            return;
                                        }
                                    } else {
                                        console.error(error);
                                    }
                                }
                            }
                        })
                    }).then(
                        async () => {
                            interaction.editReply(`Added <@&${args[1]}> to ${counter} members.`);

                        });
                    break

                case "remove":
                    await interaction.reply(`Startet removing <@&${args[1]}> from all members of <@&${args[2]}>`);
                    var counter = 0;

                    interaction.guild.members.fetch().then(fetchedMembers => {
                        var allMembers = fetchedMembers.filter(member => member.roles.cache.has(args[2]));
                        allMembers = allMembers.filter(member => member.roles.cache.has(args[1]));
                        allMembers.forEach(async member => {
                            if (!await isOwner(member)) {
                                counter++;
                                await member.roles.remove(member.guild.roles.cache.get(args[1]));
                                await sleep(0.5);

                            }
                        })
                    }).then(
                        async () => {
                            interaction.editReply(`Removed <@&${args[1]}> from ${counter} members.`);
                        });
                    break

                default:
                    sendError(interaction, "Invalid type", true, true)
                    break
            }
        } catch (error) {
            sendError(interaction, "Something went wrong!", true, false)
            logger.error(error)
        }
    }
}