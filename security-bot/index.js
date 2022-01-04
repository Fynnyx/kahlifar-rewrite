import { config } from "dotenv";
import { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { readFile } from 'fs/promises'
import { send } from "process";

config();

const data = JSON.parse(await readFile(new URL("./properties.json", import.meta.url)))

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
})

// const TOKEN = String(process.env.TOKEN);
const PREFIX = data.prefix
const DELETETIME = data.deletetime

client.on("ready", () => {
    // sendVerify()
    console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in with PREFIX \x1b[33m${PREFIX}\x1b[0m`)
})

async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
}

async function checkPermission(command, user) {
    let commands = JSON.parse(await readFile(new URL("./commands.json", import.meta.url)))
    for (let perm of commands[command].permissions) {
        if (user.roles.cache.some(role => role.name === perm)) {
            return true
        }
    }
    return false
}

async function getCommandByAlias(alias) {
    let commands = JSON.parse(await readFile(new URL("./commands.json", import.meta.url)))
    for (let command in commands) {
        if (commands[command].aliases.includes(String(alias))) {
            return command
        }
    }
    return undefined
}

async function sendError(channel, message) {
    let errorEmbed = new MessageEmbed()
        .setColor("#f23a3a")
        .setTitle("⛔ Error -")
        .setDescription(message)
    let msg = await channel.send({ embeds: [errorEmbed] })
    await sleep(DELETETIME)
    msg.delete()
}

async function sendWarn(channel, message) {
    let errorEmbed = new MessageEmbed()
        .setColor("#fca503")
        .setTitle("⚠ Warning -")
        .setDescription(message)
    let msg = await channel.send({ embeds: [errorEmbed] })
    await sleep(DELETETIME)
    msg.delete()
}


async function sendVerify() {
    let channel = client.channels.cache.get(data.verify.channel)
    channel.bulkDelete(100)
    let verifyEmbed = new MessageEmbed()
        .setColor(data.verify.color)
        .setDescription(data.verify.message)

    let row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("verify")
                .setLabel(data.verify.button)
                .setStyle(data.verify.bcolor)
        )
    channel.send({ embeds: [verifyEmbed], components: [row] })
}

async function deleteMessages(channel, amount) {
    let counter = 0
    await channel.bulkDelete(amount, true)

    console.log(counter);
    let deletedMsg = await channel.send("🗑 - Deleted `min. " + amount + "` messages.")
    await sleep(2)
    await deletedMsg.delete()
    }

client.on("messageCreate", async (message) => {
    // console.log(message)
    let channel = message.channel
    if (message.content.startsWith(PREFIX)) {
        let content = message.content.replace(PREFIX, "");
        let contentArray = content.split(" ");
        let command = contentArray[0]

        console.log(command);

        switch (command.toLowerCase()) {
            case "verify":
            case "v":
                {
                    if (await checkPermission("verify", message.member)) {
                        sendVerify()
                    } else {
                        await sendWarn(channel, data.messages.permission)
                        message.delete()
                    }
                    break

                }
            case "clear":
            case "c":
                {
                    if (await checkPermission("clear", message.member)) {
                        let amount = contentArray[1]
                        if (amount != undefined) {
                            if (amount == "all") {
                                amount = 100
                            } else {
                                try {
                                    amount = Number(contentArray[1])
                                } catch {
                                    sendError(message.channel, "This is not a usable value")
                                }
                            }
                        } else {
                            amount = 100
                        }
                        await deleteMessages(channel, amount)
                    } else {
                        await sendWarn(channel, data.messages.permission)
                    }
                    break
                }
            default: {
                console.log("command not found");
                channel.send("Command not found")
            }
        }
    }
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.customId == "verify") {
        let mrole = interaction.member.guild.roles.cache.get(data.verify.memberrole)
        let brole = interaction.member.guild.roles.cache.get(data.verify.basicrole)
        interaction.member.roles.add(mrole)
        interaction.reply({ ephemeral: true, content: data.verify.verifiedmsg })
        await sleep(3)
        interaction.member.roles.remove(brole)

    }
});

client.login(process.env.TOKEN)