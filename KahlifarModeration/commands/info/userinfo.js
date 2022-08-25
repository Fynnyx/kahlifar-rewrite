const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const data = require("../../properties.json")
const logger = require("../../handlers/logger")


module.exports = {

    name: "userinfo",
    description: "Get information about a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "user",
            description: "Select the user witch you want to recieve the information from.",
            type: "USER",
            required: true
        }

    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        try {
            const guild = interaction.guild
            const member = guild.members.cache.get(args[0])
            const user = member.user

            // sort roles by position
            const roles = member.roles.cache.sort((a, b) => b.position - a.position)

            let roleString = "<@&" + roles.map(r => r.id).join(">,\n<@&") + ">"
            let permissionString = member.permissions.toArray().sort().join(",\n")
            // let permissions = member.permissions.cache.map(p => p.toString()).join(",\n ")

            const roleinfoEmbed = new MessageEmbed()
                .setTitle(`${user.tag}`)
                .setDescription(`Infos über <@${member.id}>`)
                .setColor(user.accentColor || member.displayColor)
                .setThumbnail(member.avatarURL() || user.displayAvatarURL())
                .addFields({
                        name: "ID",
                        value: member.id,
                        inline: true
                    },
                    {
                        name: "Nickname",
                        value: member.nickname || "*Kein Nickname*",
                        inline: true
                    },
                    {
                        name: "Top-Farbe",
                        value: `${member.displayHexColor}`,
                        inline: true
                    },
                    {
                        name: "Gejoint am",
                        value: `${member.joinedAt.getDate()}. ${member.joinedAt.getMonth() + 1} ${member.joinedAt.getFullYear()}`,
                        inline: true
                    },
                    {
                        name: "Erstellt am",
                        value: `${user.createdAt.getDate()}. ${user.createdAt.getMonth() + 1} ${user.createdAt.getFullYear()}`,
                        inline: true
                    },
                    {
                        name: "Letzer Boost am",
                        value: member.premiumSince ? `${member.premiumSince.getDate()}. ${member.premiumSince.getMonth() + 1} ${member.premiumSince.getFullYear()}` : "*Kein Boost*",
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: false
                    },
                    {
                        name: "Bot",
                        value: user.bot ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Kickbar",
                        value: member.kickable ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Bannbar",
                        value: member.bannable ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Manageable",
                        value: member.managed ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Moderierbar",
                        value: member.hoist ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "- Rollen & Rechte -",
                        value: "\u200b",
                        inline: false
                    },
                    {
                        name: `Rollen (${member.roles.cache.size})`,
                        value: roleString,
                        inline: true
                    },
                    {
                        name: "Rechte",
                        value: permissionString,
                        inline: true
                    }
                    
                )
            interaction.reply({embeds: [roleinfoEmbed], ephemeral: true})

        } catch (error) {
            sendError(interaction, "Something went wrong!", false, true)
            logger.error(error)
        }
    }
}