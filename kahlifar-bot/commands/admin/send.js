const { Client, CommandInteraction } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)
const { getEmbedFromJSON } = require(`${process.cwd()}/helpers/getEmbedFromJSON.js`)


module.exports = {

    name: "send",
    description: "Sende einen TEXT, EMBED, SELECT, EXTRA.",
    type: 'CHAT_INPUT',
    userPermissions: ["ADMINISTRATOR"],
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

                break

            case "EMBED":
                getEmbedFromJSON(`${process.cwd()}/assets/embeds/${file}.json`).then((embed) => {
                    console.log(embed);
                    interaction.channel.send({ embed: [embed] })
                })
                interaction.reply({ content: "Embed `" + file + "` has been sent." })
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
        await interaction.reply({ content: `Comming soon ${interaction.options.data[0].value}` })
    }
}