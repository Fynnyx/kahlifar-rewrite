const { default: axios } = require("axios")
const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { writeFileSync } = require("fs")
const logger = require("../../handlers/logger")
const { sendError, sendInfo, sendWarn } = require("../../helpers/send")
const data = require(`${process.cwd()}/properties.json`)
const streamData = require(`${process.cwd()}/streamer.json`)

const options = {
    name: "streamername",
    description: "Define the streamers name.",
    type: "STRING",
    required: true
}

const streamerOptionsArray = []

streamData.streamer.forEach(streamer => {
    streamerOptionsArray.push({ name: streamer.name, value: streamer.name })
})



module.exports = {

    name: "streamer",
    description: "Bearbeite die Streamer Liste.",
    type: 'CHAT_INPUT',
    rolePermissions: ["814234539773001778"],

    options: [
        {
            name: "add",
            description: "Add a new Streamer",
            type: "SUB_COMMAND",
            options: [
                options,
                {
                    name: "user",
                    description: "Add a Discord User Account to this Streamer",
                    type: "USER",
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a Streamer.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "streamer",
                    description: "Remove a Streamer",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "list",
            description: "List all notification Streamer.",
            type: "SUB_COMMAND"
        },
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
                    if (interaction.member.roles.cache.some(role => role.id === data.commands.streamer.streamerRole) === false && interaction.member.roles.cache.some(role => role.id === data.commands.streamer.adminRole) === false) {
                        return sendError(interaction, "Du hast keine Berechtigung für diesen Befehl!", false, true)
                    }
                    args[1] = args[1].toLowerCase()
                    const response = await axios.get(`https://api.twitch.tv/helix/users?login=${args[1]}`)
                        .catch(err => {
                            return sendError(interaction, response.data.error, true)
                        })
                    if (await isRegisteredStreamer(args[1])) {
                        return sendError(interaction, `Streamer ${"`" + args[1] + "`"} is already registered.`, true)
                    }
                    if (response.data.data.length === 0) {
                        return sendError(interaction, `Der Benutzer/Streamer ${"`" + args[1] + "`"} konnte nicht gefunden wurden`, false, false)
                    } else {
                        var id = null
                        if (args[2] !== undefined) {
                            id = args[2]
                        }
                        let newStreamer = {
                            name: args[1],
                            discordId: id,
                            lastStreamId: ""
                        }
                        streamData.streamer.push(newStreamer)
                        let JSONData = JSON.stringify(streamData, null, 2)
                        writeFileSync(`${process.cwd()}/streamer.json`, JSONData)
                        return sendInfo(interaction, `Added ${args[1]} to the notification list.`, false, false)
                    }
                    break

                case "remove":
                    if (interaction.member.roles.cache.some(role => role.id === data.commands.streamer.streamerRole) === false && interaction.member.roles.cache.some(role => role.id === data.commands.streamer.adminRole) === false) {
                        return sendError(interaction, "Du hast keine Berechtigung für diesen Befehl!", false, true)
                    }
                    if (! await isRegisteredStreamer(args[1])) {
                        return sendError(interaction, `Streamer ${"`" + args[1] + "`"} is not registered.`, true)
                    }
                    streamData.streamer.forEach((streamer) => {
                        if (streamer.name === args[1]) {
                            streamData.streamer.splice(streamData.streamer.indexOf(streamer), 1)
                            writeFileSync(`${process.cwd()}/streamer.json`, JSON.stringify(streamData, null, 2))
                            return sendInfo(interaction, `Removed ${args[1]} from the notification list.`, false, false)
                        }
                        // return sendWarn(interaction, `Streamer ${"`" + args[1] + "`"} is not registered.`, true)
                    })

                    break

                case "list":
                    const streamerEmbed = new MessageEmbed()
                        .setTitle(`Streamer List:`)
                        .setDescription("Streams dieser Streamer werden in dem Channel benachrichtigt.")
                        .setColor("#6441a5")

                    streamData.streamer.forEach((streamer) => {
                        var id = `<@${streamer.discordId}>`
                        if (streamer.discordId == null) {
                            id = "*none*"
                        }
                        streamerEmbed.addField(streamer.name, id)
                    })
                    interaction.reply({ embeds: [streamerEmbed], ephermal: true })
                    break

                default:
                    sendError(interaction, "Invalid type", true, true)
                    break
            }
        } catch (e) {
            sendError(interaction, "Someting went wrong", false, true)
            logger.error(e)
        }
    }
}

async function isRegisteredStreamer(streamerName) {
    var returnValue = false

    streamData.streamer.forEach(streamer => {
        if (streamer.name == streamerName) {
            returnValue = true
        }
    })
    return returnValue
}