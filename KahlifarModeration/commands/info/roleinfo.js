const { Client, CommandInteraction, MessageEmbed } = require("discord.js")
const { sendError } = require("../../helpers/send")
const data = require("../../properties.json")
const logger = require("../../handlers/logger")


module.exports = {

    name: "roleinfo",
    description: "Get information about a role.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "role",
            description: "Select role witch you want to recieve the information.",
            type: "ROLE",
            required: true
        }

    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        // try {
            const guild = interaction.guild
            const role = guild.roles.cache.get(args[0])

            let memberString = "<@" + role.members.map(m => m.id).join(">,\n<@") + ">"
            let permissionString = role.permissions.toArray().sort().join(",\n")


            const roleinfoEmbed = new MessageEmbed()
                .setTitle(`${role.name}`)
                .setDescription(`Infos über <@&${role.id}>`)
                .setColor(role.color)
                .setThumbnail(role.iconURL())
                .addFields({
                        name: "ID",
                        value: role.id,
                        inline: true
                    },
                    {
                        name: "Mitglieder",
                        value: role.members.size.toString(),
                        inline: true
                    },
                    {
                        name: "Farbe",
                        value: `${role.hexColor}`,
                        inline: true
                    },
                    {
                        name: "Erstellt am",
                        value: `${role.createdAt.getDate()}. ${role.createdAt.getMonth() + 1} ${role.createdAt.getFullYear()}`,
                        inline: true
                    },
                    {
                        name: "Position",
                        value: role.position.toString(),
                        inline: true
                    },
                    {
                        name: "\u200b",
                        value: "\u200b",
                        inline: false
                    },
                    {
                        name: "Pingbar (von jedem)",
                        value: role.mentionable ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Gemanaged",
                        value: role.managed ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "Separiert",
                        value: role.hoist ? "Ja" : "Nein",
                        inline: true
                    },
                    {
                        name: "- User & Rechte -",
                        value: "\u200b",
                        inline: false
                    },
                    {
                        name: `User (${role.members.size})`,
                        value: role.members.size >= 20 ? "*Too many users to display*" : role.members.size !== 0 ? memberString : "*No user got this role*",
                        inline: true
                    },
                    {
                        name: "Rechte",
                        value: permissionString !== "" ? permissionString : "*No permissions set*",
                        inline: true
                    }
                )
            interaction.reply({embeds: [roleinfoEmbed], ephemeral: true})

        // } catch (error) {
        //     sendError(interaction, "Something went wrong!", false, true)
        //     logger.error(error)
        // }
    }
}