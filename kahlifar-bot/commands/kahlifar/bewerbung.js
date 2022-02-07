const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { sendInfo, sendError, sendSuccess } = require("../../helpers/send")
const data = require(`${process.cwd()}/properties.json`)


module.exports = {

    name: "bewerbung",
    description: "Sende eine Bewerbung für den Kahlifar Minecraft Server.",
    type: 'CHAT_INPUT',
    rolePermissions: [],
    options: [
        {
            name: "alter",
            description: "Bitte gebe dein Alter an.",
            type: "NUMBER",
            required: true,
        },
        {
            name: "minecraftname",
            description: ".",
            type: "STRING",
            required: true
        },
        {
            name: "entdeckung",
            description: "WIe bist du auf Kahlifar gestossen?",
            type: "STRING",
            required: true
        },
        {
            name: "weiteres",
            description: "Weiters was du uns erzählen möchtest.",
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
        let bewEmbed = new MessageEmbed()
            .setTitle(`Neue Bewerbung von - ${interaction.member.displayName}`)
            .setColor("#7fa7d4")
            .addFields(
                { name: "Alter:", value: args[0].toString(), inline: true },
                { name: "Minecraftname", value: args[1], inline: true },
                { name: "Entdeckung:", value: args[2], inline: false }
            )
            .setTimestamp()
            .setFooter(args[1])
        if (args[3]) {
            bewEmbed.setDescription(`${interaction.member}: ${args[3]}`)
        } else {
            bewEmbed.setDescription(`${interaction.member}: *Keine weiteren Informationen*.`)
        }

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("bew-accept")
                    .setLabel("Accept")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("bew-decline")
                    .setLabel("Deny")
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("bew-help")
                    .setLabel("Help")
                    .setStyle("SECONDARY")
            )

        let modChannel = client.channels.cache.get(data.commands.bewerbung.modChannel)
        modChannel.send({ content: `<@&${data.commands.bewerbung.pingRole}>`, embeds: [bewEmbed], components: [row] })

        // interaction.member.send(data.commands.bewerbung.messages.sendInfo)
        sendSuccess(interaction, data.commands.bewerbung.messages.send, true)
    }
}