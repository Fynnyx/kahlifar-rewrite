const { Client, CommandInteraction } = require("discord.js")
const { readFileSync, isFile } = require("fs")

const data = require(`${process.cwd()}/properties.json`)
const { getEmbedFromJSON } = require(`${process.cwd()}/helpers/getEmbedFromJSON.js`)


module.exports = {

    name: "send",
    description: "Sende einen TEXT, EMBED, SELECT, EXTRA.",
    type: 'CHAT_INPUT',
    userPermissions: ["ADMINISTRATOR"],
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
                if (!isFile(`${process.cwd()}/assets/texts/${file}.txt`)) return interaction.reply({ content: "⛔	- File not found", ephemeral: true });
                if (data.send.infoList.includes(file)) {
                    let infoWelcome = readFileSync(`${process.cwd()}/assets/texts/infoWelcome.txt`, "utf-8")
                    let infoChannel = readFileSync(`${process.cwd()}/assets/texts/infoChannels.txt`, "utf-8")
                    let infoRoles = readFileSync(`${process.cwd()}/assets/texts/infoRoles.txt`, "utf-8")
                    interaction.channel.send(infoWelcome)
                    interaction.channel.send(infoChannel)
                    interaction.channel.send(infoRoles)
                } else {
                    let text = readFileSync(`${process.cwd()}/assets/texts/${file}.txt`, "utf-8")
                    interaction.channel.send({ content: text })
                }
                interaction.reply({ content: "Text `" + file + "` has been sent.", ephemeral: true })
                break

            case "EMBED":
                getEmbedFromJSON(`${process.cwd()}/assets/embeds/${file}.json`).then((embed) => {
                    interaction.channel.send({ embeds: [embed] })
                })
                interaction.reply({ content: "Embed `" + file + "` has been sent.", ephemeral: true })
                break

            case "SELECT":
                switch (file) {

                }
                break

            case "EXTRA":
                switch (file) {
                    case "verify":
                    // Send the verify button
                }
                console.log(interaction.options.data[0].value);
                break

            default:
                console.log(interaction.options.data[0].value);
                break
        }
        // await interaction.reply({ content: `Comming soon ${interaction.options.data[0].value}` })
    }
}