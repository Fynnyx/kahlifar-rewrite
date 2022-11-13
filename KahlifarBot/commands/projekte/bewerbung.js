const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { sendInfo, sendError, sendSuccess } = require("../../helpers/send")
const { checkUsername } = require("../../helpers/minecraft")
const logger = require("../../handlers/logger")
const data = require(`${process.cwd()}/properties.json`)


module.exports = {

    name: "bewerbung",
    description: "Sende eine Bewerbung für den Kahlifar Minecraft Server.",
    type: 'CHAT_INPUT',
    rolePermissions: [],
    options: [
        {
            name: "minecraft",
            description: "Bewerbung für das Minecraft Projekt.",
            type: "SUB_COMMAND",
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
                // {
                //     name: "entdeckung",
                //     description: "WIe bist du auf Kahlifar gestossen?",
                //     type: "STRING",
                //     required: true
                // },
                {
                    name: "weiteres",
                    description: "Weiters was du uns erzählen möchtest.",
                    type: "STRING",
                    required: false
                }
            ]
        },
        // {
        //     name: "ark",
        //     description: "Bewerbung für das ARK Projekt.",
        //     type: "SUB_COMMAND",
        //     options: [
        //         {
        //             name: "alter",
        //             description: "Bitte gebe dein Alter an.",
        //             type: "NUMBER",
        //             required: true,
        //         },
        //         {
        //             name: "steamid",
        //             description: "Bitte gebe deine SteamID an.",
        //             type: "STRING",
        //             required: true
        //         },
        //         {
        //             name: "projektart",
        //             description: "Möchtest du PVE oder PVP spielen?",
        //             type: "STRING",
        //             required: true,
        //             choices: [
        //                 {
        //                     name: "PVE",
        //                     value: "PVE"
        //                 },
        //                 {
        //                     name: "PVP",
        //                     value: "PVP"
        //                 }
        //             ]
        //         },
        //         {
        //             name: "spielzeit",
        //             description: "Wie lange spielst du schon ARK?",
        //             type: "STRING",
        //             required: true,

        //         },
        //         {
        //             name: "weiteres",
        //             description: "Weiters was du uns erzählen möchtest.",
        //             type: "STRING",
        //             required: false
        //         }
        //     ]
        // }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
        switch (args[0]) {
            case "minecraft":
                if (interaction.member.roles.cache.has(data.commands.bewerbung.mc.role)) {
                    sendError(interaction, "Du bist bereits angenommen worden.", true, true)
                } else {
                    interaction.deferReply({ ephemeral: true })
                    let mcData = await checkUsername(args[2]);
                    if (mcData == 500) {
                        return sendInfo(interaction, "Der username konnte aufgrund eines Server Errors nicht gerpüft werden.\nVersuche es später nochmal.")
                    }
                    if (mcData == undefined) {
                        return sendError(interaction, "The username is not valid.", true, true);
                    }
                    let bewEmbed = new MessageEmbed()
                        .setTitle(`Neue Bewerbung von - ${interaction.member.displayName}`)
                        .setColor("#187CA1")
                        .addFields(
                            { name: "Alter:", value: args[1].toString(), inline: true },
                            { name: "Minecraftname", value: args[2], inline: true },
                            // { name: "Entdeckung:", value: args[3], inline: false }
                        )
                        .setTimestamp()
                        .setFooter({ text: args[2] })
                    if (args[3]) {
                        bewEmbed.setDescription(`${interaction.member}: ${args[3]}`)
                    } else {
                        bewEmbed.setDescription(`${interaction.member}: *Keine weiteren Informationen*.`)
                    }

                    let row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId("bew-mc-accept")
                                .setLabel("Accept")
                                .setStyle("SUCCESS"),
                            new MessageButton()
                                .setCustomId("bew-mc-decline")
                                .setLabel("Deny")
                                .setStyle("DANGER"),
                            new MessageButton()
                                .setCustomId("bew-help")
                                .setLabel("Help")
                                .setStyle("SECONDARY")
                        )

                    let modChannel = client.channels.cache.get(data.commands.bewerbung.modChannel)
                    modChannel.send({ content: `<@&${data.commands.bewerbung.pingRole}>`, embeds: [bewEmbed], components: [row] })

                    interaction.member.send(data.commands.bewerbung.messages.sendInfo)
                    sendSuccess(interaction, data.commands.bewerbung.messages.send, true, true)

                }
                break;
            // case "ark":
            //     if (interaction.member.roles.cache.has(data.commands.bewerbung.ark.role)) {
            //         sendError(interaction, "Du bist bereits angenommen worden.", true, true)
            //     } else {
            //         let bewEmbed = new MessageEmbed()
            //             .setTitle(`Neue Bewerbung von - ${interaction.member.displayName}`)
            //             .setColor("#25a244")
            //             .addFields(
            //                 { name: "Alter:", value: args[1].toString(), inline: true },
            //                 { name: "SteamID:", value: args[2], inline: true },
            //                 { name: "Projektart:", value: args[3], inline: true },
            //                 { name: "Spielzeit:", value: args[4], inline: true }
            //             )
            //             .setTimestamp()
            //         if (args[5]) {
            //             bewEmbed.setDescription(`${interaction.member}: ${args[5]}`)
            //         } else {
            //             bewEmbed.setDescription(`${interaction.member}: *Keine weiteren Informationen*.`)
            //         }
            //         let row = new MessageActionRow()
            //             .addComponents(
            //                 new MessageButton()
            //                     .setCustomId("bew-ark-accept")
            //                     .setLabel("Accept")
            //                     .setStyle("SUCCESS"),
            //                 new MessageButton()
            //                     .setCustomId("bew-ark-decline")
            //                     .setLabel("Deny")
            //                     .setStyle("DANGER"),
            //                 new MessageButton()
            //                     .setCustomId("bew-help")
            //                     .setLabel("Help")
            //                     .setStyle("SECONDARY")
            //             )

            //         let modChannel = client.channels.cache.get(data.commands.bewerbung.modChannel)
            //         modChannel.send({ content: `<@&${data.commands.bewerbung.pingRole}>`, embeds: [bewEmbed], components: [row] })

            //         interaction.member.send(data.commands.bewerbung.messages.sendInfo)
            //         sendSuccess(interaction, data.commands.bewerbung.messages.send, true, true)

            //     }
            default:
                break;
        }
        } catch (e) {
            sendError(interaction, "Something went wrong", false, true)
            logger.error(e)
        }
    }
}