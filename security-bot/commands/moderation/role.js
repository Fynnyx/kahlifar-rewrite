const { Client, CommandInteraction, DiscordAPIError } = require("discord.js")
const { sendInfo, sendError, sendWarn } = require("../../helpers/send")
const { isOwner } = require("../../helpers/isOwner")
const { sleep } = require("../../helpers/sleep")
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
            name: "role",
            description: "Select the role which should me added.",
            type: "ROLE",
            required: true
        },
        {
            name: "memberrole",
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
        switch (args[0]) {
            case "ADD":
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

            case "REMOVE":
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
                });
                interaction.editReply(`Removed <@&${args[1]}>`);
                break


            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
    }
}