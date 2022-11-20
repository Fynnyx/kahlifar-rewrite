const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const logger = require("../../handlers/logger")
const { sendError, sendInfo, sendWarn } = require("../../helpers/send")
const data = require(`${process.cwd()}/properties.json`)

const amount = {
    name: "amount",
    description: "Wie viele Channel geöffnet werden sollen",
    type: "INTEGER",
    required: false
}



module.exports = {

    name: "event",
    description: "Manage den Event Bereich.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "open",
            description: "Öffne den Event Bereich.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "enable",
                    description: "Öffne die Voice Channel.",
                    type: "BOOLEAN",
                    required: true
                },
                amount
            ]
        },
        {
            name: "close",
            description: "Schliesse den Event Bereich.",
            type: "SUB_COMMAND",
        },
        {
            name: "enable",
            description: "Öffne die Voice Channel.",
            type: "SUB_COMMAND",
            options: [
                amount
            ]
        },
        {
            name: "disable",
            description: "Schliesse die Voice Channel.",
            type: "SUB_COMMAND"
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        switch (args[0]) {
            case "open":
                const openEventCategory = interaction.guild.channels.cache.find(c => c.id == data.commands.event.eventCategoryId && c.type == "GUILD_CATEGORY")
                if (!openEventCategory) {
                    logger.error(`Event category not found!`)
                    return sendError(interaction, "An Error occured")
                }
                for (role of data.commands.event.roles) {
                    const roleToFind = interaction.guild.roles.cache.find(r => r.id == role)
                    openEventCategory.permissionOverwrites.edit(roleToFind, {
                        VIEW_CHANNEL: true,
                        CONNECT: args[1]
                    })
                }
                interaction.reply({ content: `Event Bereich wurde geöffnet.\nVoice Channels: ${args[1] ? "`open`" : "`false`"}`, ephemeral: true })
                break;
            case "close":
                const closeEventCategory = interaction.guild.channels.cache.find(data.commands.event.eventCategoryId)
                if (!closeEventCategory) {
                    logger.error(`Event category not found!`)
                    return sendError(interaction, "An Error occured")
                }
                for (role of data.commands.event.roles) {
                    const roleToFind = interaction.guild.roles.cache.find(r => r.id == role)
                    closeEventCategory.permissionOverwrites.edit(roleToFind, {
                        VIEW_CHANNEL: false,
                        CONNECT: false
                    })
                }
                // sync channels with category
                for (channel of closeEventCategory.children) {
                    if (channel.id == data.commands.event.disabledSyncChannels) continue
                    channel.lockPermissions()
                }
                interaction.reply({ content: `Event Bereich wurde geschlossen.`, ephemeral: true })
                break;
            case "enable":
                const enableEventCategory = interaction.guild.channels.cache.find(data.commands.event.eventCategoryId)
                if (!enableEventCategory) {
                    logger.error(`Event category not found!`)
                    return sendError(interaction, "An Error occured")
                }
                // for vc in category enable connect
                for (const channel of enableEventCategory.children) {
                    if (channel.id == data.commands.event.disabledSyncChannels) continue
                    for (role of data.commands.event.roles) {
                        const roleToFind = interaction.guild.roles.cache.find(r => r.id == role)
                        channel.permissionOverwrites.edit(roleToFind, {
                            CONNECT: true
                        })
                    }
                }
                interaction.reply({ content: `Event Voice Channels wurden geöffnet.`, ephemeral: true })
            case "disable":

            default:
                break;
        }

    }
}