const { ActionRow } = require("@discordjs/builders")
const { Client, CommandInteraction } = require("discord.js")
const { readFileSync, existsSync } = require("fs")
const logger = require("../../handlers/logger")
const { sendInfo, sendError } = require("../../helpers/send")
const { getEmbedFromJSON, getSelectFromJSON } = require(`${process.cwd()}/helpers/getFromJSON.js`)
const data = require(`${process.cwd()}/properties.json`)

const options = [
    {
        name: "filename",
        description: "Wähle den Dateinamen ohne Endung.",
        type: "STRING",
        required: true
    },
    {
        name: "clear",
        description: "Cleare den Channel bevor gesendet wird.",
        type: "BOOLEAN",
        required: true
    }
]

module.exports = {

    name: "send",
    description: "Sende einen TEXT, EMBED, SELECT, EXTRA.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_MESSAGES"],
    rolePermissions: ["814234539773001778"],

    options: [
        {
            name: "text",
            description: "Sende einen normalen Text.",
            type: "SUB_COMMAND",
            options: options
        },
        {
            name: "embed",
            description: "Sende ein EMBED.",
            type: "SUB_COMMAND",
            options: options
        },
        {
            name: "select",
            description: "Sende ein SELECT/Dropdown.",
            type: "SUB_COMMAND",
            options: options
        },
        {
            name: "extra",
            description: "Für spezuelle Dinge.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "type",
                    description: "Wähle den Typ.",
                    type: "STRING",
                    reqired: true,
                    choices: [
                        {
                            name: "information",
                            value: "information",
                        }
                    ]
                }
            ]
        },

    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {

            const file = args[1]
            if (file === "example") interaction.reply({ content: "⛔	- You cant send an example", ephemeral: true });
            if (args[2] === true) {
                await interaction.channel.bulkDelete(100, true)
            }
            switch (args[0].toLowerCase()) {
                case "text":
                    try {
                        if (existsSync(`${process.cwd()}/assets/texts/${file}.txt`)) {
                            let text = readFileSync(`${process.cwd()}/assets/texts/${file}.txt`, "utf-8")
                            interaction.channel.send({ content: text })
                            sendInfo(interaction, `Text ${file} wurde gesendet.`, true, true)
                        } else {
                            sendError(interaction, `Text ${file} existiert nicht.`, true, true)
                        }
                    } catch (e) {
                        sendError(interaction, "File not found", true, true)
                    }
                    break

                case "embed":
                    getEmbedFromJSON(`${process.cwd()}/assets/embeds/${file}.json`).then((embed) => {
                        interaction.channel.send({ embeds: [embed] })
                    })
                    sendInfo(interaction, `Embed ${"`" + file + "`"} sent`, true, true)
                    break

                case "select":
                    getSelectFromJSON(`${process.cwd()}/assets/selects/${file}.json`).then((selectData) => {
                        let row = new ActionRow()
                            .addComponents(selectData.select)
                        interaction.channel.send({ content: selectData.message, components: [row] })
                    })
                    sendInfo(interaction, `Select ${"`" + file + "`"} sent`, true, true)

                    break

                case "extra":
                    // if file is a file
                    switch (args[1].toLowerCase()) {
                        case "information":
                            for (let file of data.commands.send.information.infoAssets) {
                                console.log(file);
                                switch (file.type) {
                                    case "TEXT":
                                        const text = readFileSync(`${process.cwd()}/assets/extra/information/text/${file.file}`, "utf-8")
                                        await interaction.channel.send(text)
                                        break
                                    case "IMAGE":
                                        await interaction.channel.send({ files: [`${process.cwd()}/assets/extra/information/images/${file.file}`] })
                                        break
                                    case "EMBED":
                                        break

                                    default:
                                        break
                                }
                            }

                        default:
                            sendError(interaction, "Invalid type", true, true)
                            break
                    }
                    sendInfo(interaction, `Text **Information** wurde gesendet.`, false, true)
                    break

                default:
                    sendError(interaction, "Invalid type", true, true)
                    break
            }
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}