const { Client, CommandInteraction } = require("discord.js")
const { writeFile } = require("fs")
const { sendInfo, sendError, sendSuccess } = require("../../helpers/send")
const { startStatus, stopStatus, setStatus } = require(`${process.cwd()}/helpers/status.js`)
const data = require(`${process.cwd()}/properties.json`)

const options = [
    {
        name: "value",
            description: "Setzte den Wert für Set oder News.",
            type: "STRING",
            required: true
    }
]


module.exports = {

    name: "status",
    description: "Verändere den Status des Bots.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_NICKNAMES"],
    rolePermissions: ["814234539773001778"],
    options: [
        {
            name: "start",
            description: "Starte die Zirkulation durch die Staten.",
            type: "SUB_COMMAND"
        },
        {
            name: "stop",
            description: "Stoppe die Zirkulation durch die Staten.",
            type: "SUB_COMMAND"
        },
        {
            name: "set",
            description: "Setze den Status des Bots.",
            type: "SUB_COMMAND",
            options: options
        },
        {
            name: "news",
            description: "Setze den News-Status des Bots.",
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
        const file = args[1]
        if (file === "example") interaction.reply({ content: "⛔	- You cant send an example", ephemeral: true });
        switch (args[0].toLowerCase()) {
            case "start":
                startStatus()
                sendInfo(interaction, "Status wurde gestartet.", true, true)
                break

            case "stop":
                stopStatus()
                sendInfo(interaction, "Status wurde gestoppt.", true, false)
                break

            case "set":
                if (args[1] === undefined) {
                    sendError(interaction, `Du musst eine Nachricht angeben.`, true, false)
                    break
                }
                setStatus(args[1])
                sendSuccess(interaction, `Status wurde auf "${args[1]}" gesetzt.`, true)
                break

            case "news":
                if (args[1] === undefined) {
                    sendError(interaction, "Du musst eine Nachricht angeben.", true, false)
                    break
                }
                data.commands.status.statusList[0] = "[❗] " + args[1];
                let jsonData = JSON.stringify(data, null, 4)
                writeFile("./properties.json", jsonData, function (err, result) {
                    if (err) console.error('error', err);
                });
                sendInfo(interaction, `News Status auf "${args[1]}" geupdated.`, true)        
                break

            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
    }
}