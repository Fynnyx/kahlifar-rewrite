const { Client, CommandInteraction } = require("discord.js")
const { sendInfo, sendError, sendSuccess } = require("../../helpers/send")
const { startStatus, stopStatus, setStatus } = require(`${process.cwd()}/helpers/status.js`)


module.exports = {

    name: "status",
    description: "Verändere den Status des Bots.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_NICKNAMES"],
    rolePermissions: ["814234539773001778"],
    options: [
        {
            name: "type",
            description: "Wähle START, STOP, SET oder NEWS.",
            type: "STRING",
            required: true,
            choices: [
                { name: "START", value: "START" },
                { name: "STOP", value: "STOP" },
                { name: "SET", value: "SET" }
            ]
        },
        {
            name: "value",
            description: "Für SET brauchst du eine Nachricht die gesetzt wird.",
            type: "STRING",
            required: false
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
        switch (args[0]) {
            case "START":
                startStatus()
                sendInfo(interaction, "Status wurde gestartet.", true, true)
                break

            case "STOP":
                stopStatus()
                sendInfo(interaction, "Status wurde gestoppt.", true, false)
                break

            case "SET":
                if (args[1] === undefined) {
                    sendError(interaction, `Du musst eine Nachricht angeben.`, true, false)
                    break
                }
                setStatus(args[1])
                sendSuccess(interaction, `Status wurde auf "${args[1]}" gesetzt.`, true)
                break

            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
    }
}