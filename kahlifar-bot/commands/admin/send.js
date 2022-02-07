const { ActionRow } = require("@discordjs/builders")
const { Client, CommandInteraction } = require("discord.js")
const { readFileSync, lstatSync, existsSync } = require("fs")
const { sendInfo, sendError } = require("../../helpers/send")
const { getEmbedFromJSON, getSelectFromJSON } = require(`${process.cwd()}/helpers/getFromJSON.js`)
const data = require(`${process.cwd()}/properties.json`)


module.exports = {

    name: "send",
    description: "Sende einen TEXT, EMBED, SELECT, EXTRA.",
    type: 'CHAT_INPUT',
    userPermissions: ["MANAGE_MESSAGES"],
    rolePermissions: ["814234539773001778"],
    options: [
        {
            name: "type",
            description: "Setze ob es ein TEXT, EMBED, SELECT oder ein EXTRA ist.",
            type: "STRING",
            required: true,
            choices: [
                { name: "TEXT", value: "TEXT" },
                { name: "EMBED", value: "EMBED" },
                { name: "SELECT", value: "SELECT" },
                { name: "EXTRA", value: "EXTRA" },
            ]
        },
        {
            name: "filename",
            description: "Wähle den Dateinamen ohne Endung.",
            type: "STRING",
            required: true
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
            case "TEXT":
                // if file is a file
                if (data.commands.send.infoList.includes(file)) {
                    let infoWelcome = readFileSync(`${process.cwd()}/assets/texts/infoWelcome.txt`, "utf-8")
                    let infoChannel = readFileSync(`${process.cwd()}/assets/texts/infoChannels.txt`, "utf-8")
                    let infoRoles = readFileSync(`${process.cwd()}/assets/texts/infoRoles.txt`, "utf-8")
                    interaction.channel.send(infoWelcome)
                    interaction.channel.send(infoChannel)
                    interaction.channel.send(infoRoles)
                } else {
                    try {
                        if (!existsSync(`${process.cwd()}/assets/texts/${file}.txt`)) {
                            let text = readFileSync(`${process.cwd()}/assets/texts/${file}.txt`, "utf-8")
                            interaction.channel.send({ content: text })
                        }
                    } catch (e) {
                        // return interaction.reply({ content: "⛔	- File not found", ephemeral: true });
                        sendError(interaction, "File not found", true, true).then((embed) => {
                            return interaction.reply({ embeds: [embed], ephemeral: true });
                        })
                    }
                }
                break

            case "EMBED":
                getEmbedFromJSON(`${process.cwd()}/assets/embeds/${file}.json`).then((embed) => {
                    interaction.channel.send({ embeds: [embed] })
                })
                sendInfo(interaction, `Embed ${"`"+file+"`"} sent`, true, true)
                break

            case "SELECT":
                getSelectFromJSON(`${process.cwd()}/assets/selects/${file}.json`).then((selectData) => {
                    let row = new ActionRow()
                        .addComponents(selectData.select)
                    interaction.channel.send({ content: selectData.message, components: [row] })
                })
                sendInfo(interaction, `Select ${"`"+file+"`"} sent`, true, true)

                break

            case "EXTRA":
                break

            default:
                sendError(interaction, "Invalid type", true, true)
                break
        }
        // await interaction.reply({ content: `Comming soon ${interaction.options.data[0].value}` })
    }
}