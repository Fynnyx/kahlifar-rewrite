const { default: axios } = require("axios")
const { Client, CommandInteraction } = require("discord.js")
const { writeFileSync } = require("fs")
const { sendInfo, sendError, sendSuccess } = require("../../helpers/send")
const { startStatus, stopStatus, setStatus } = require(`${process.cwd()}/helpers/status.js`)
const data = require(`${process.cwd()}/properties.json`)
const streamData = require(`${process.cwd()}/streamer.json`)

const options = {
    name: "streamername",
    description: "Define the streamers name.",
    type: "STRING",
    required: true
}


module.exports = {

    name: "streamer",
    description: "Bearbeite die Streamer Liste.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_NICKNAMES"],
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
                    type: "USER"
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a new Streamer.",
            type: "SUB_COMMAND",
            options: [
                options
            ]
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        console.log(args);
        if (interaction.member.roles.cache.has(data.roles.streamer) || interaction.member.roles.cache.has(data.roles.owner)) {

        }
        switch (args[0]) {
            case "add":
                args[1] = args[1].toLowerCase()
                const response = await axios.get(`https://api.twitch.tv/helix/users?login=${args[1]}`)                
                if (response.data.error) {
                    return sendError(interaction, response.data.error, true)
                }
                if (isRegisteredStreamer(args[1])) {
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

                }
                break

            case "remove":
                if (!isRegisteredStreamer(args[1])) {
                    return sendError(interaction, `Streamer ${"`" + args[1] + "`"} is not registered.`, true)
                }

                break

            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
    }
}

async function isRegisteredStreamer(streamerName) {
    streamData.streamer.forEach(streamer => {
        if (streamer.name === streamerName) {
            return true
        }
    })
    return false
}