const { Message, MessageEmbed, MessageActionRow, MessageButton, Interaction } = require("discord.js")
const data = require(`${process.cwd()}/properties.json`)
const client = require("../index")

client.on("messageCreate", async message => {
    // console.log(message.channel);
    if (message.channel.type == "DM" && !message.author.bot) {
        let filter = (interaction) => interaction.customId === 'modmailconfirmation' && interaction.user.id !== client.user.id
        let modMailConfirmationEmbed = new MessageEmbed()
            .setTitle("Mod Mail Confirmation")
            .setDescription('⚠ **- Are you sure you wanna send this to the Modmail**')
            .setColor(data.helpers.send.colors.warning)
            .setFields([
                {
                    name: "Your Content",
                    value: message.content
                }
            ])
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("modmailconfirmation")
                    .setEmoji("<:mcaccept:923008500483899392>")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("modmaildeny")
                    .setEmoji("<:mcdeny:923008528103374898> ")
                    .setStyle("DANGER")
            )
        await message.author.send({ embeds: [modMailConfirmationEmbed], components: [row] })
        message.channel.awaitMessageComponent(filter, {
            time: 1000,
        })
            .then(interaction => {
                let revievedEmbed = new MessageEmbed()
                    .setTitle("New Message in ModMail")
                    .setDescription(`<@${message.author.id}> has sent a new Message.`)
                    .setColor(data.events.modmail.embedColor)
                    .setFields([
                        {
                            name: "Content",
                            value: message.content
                        }
                    ])

                let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("modmailreply")
                            .setLabel("↩ Reply")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("modmailspam")
                            .setLabel("⛔ Spam")
                            .setStyle("DANGER"),
                        new MessageButton()
                            .setCustomId("modmaildelete")
                            .setLabel("🗑 Delete")
                            .setStyle("DANGER"),
                    )
                client.channels.cache.get(data.events.modmail.channel).send({ content: `<@&${data.events.modmail.pingrole}>`, embeds: [revievedEmbed], components: [row] })
                interaction.reply("📨 - Your Mail **has** been sent to the Modmail\n*Please be patient you will get an answer soon.*")
            })
            .catch((e) => {
                console.error(e)
            })

    }
    // console.info(message.author.displayName + "Has send a message with the value\n" + message.content);
})