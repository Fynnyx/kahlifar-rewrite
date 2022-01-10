import { config } from "dotenv";
import { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { readFile, writeFile } from 'fs/promises'

config();

var data = JSON.parse(await readFile(new URL("./properties.json", import.meta.url)))

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
var statusInterval = {}

client.on("ready", async () => {
    await setStatus("Starting...")
    await startStatus()
    await updateJSONTask()
    console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in with PREFIX \x1b[33m${PREFIX}\x1b[0m`)
})

async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
}

async function updateJSONTask() {
    const propertiesInterval = setInterval(async () => {
        data = JSON.parse(await readFile(new URL("./properties.json", import.meta.url)))
    }, 15000)
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

async function getSpecHelpEmbed(command) {
    let commands = JSON.parse(await readFile(new URL("./commands.json", import.meta.url)))

    let aliasesString = ''
    let permissionsString = ''

    for (let alias of commands[command].aliases) {
        aliasesString += "`" + alias + "`, "
    }
    for (let perm of commands[command].permissions) {
        permissionsString += "`" + perm + "`, "
    }

    let specEmbed = new MessageEmbed()
        .setColor("#71368a")
        .setTitle("Hilfe für `" + command + "`.")
        .setDescription(commands[command].description)
        .addFields(
            { name: 'Aliasse', value: "- " + aliasesString },
            { name: 'Permissions', value: "- " + permissionsString }
        )
    return specEmbed
}

async function startStatus() {
    statusInterval = setInterval(() => {
        const statues = data.status.messages
        let currentStatus = statues.indexOf(client.user.presence.activities[0].name);
        let index = Math.floor(Math.random() * (statues.length))
        while (currentStatus == index) {
            index = Math.floor(Math.random() * (statues.length))
        }
        client.user.setActivity(statues[index])
    }, data.status.time * 1000)
}

async function stopStatus() {
    clearInterval(statusInterval)
    client.user.setActivity(data.status.default)
}

async function setStatus(message) {
    client.user.setActivity(message)
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

async function sendInfo(channel, message, shouldDelete) {
    let infoEmbed = new MessageEmbed()
        .setColor("#0087e8")
        .setTitle("ℹ Info -")
        .setDescription(message)
    let msg = await channel.send({ embeds: [infoEmbed] })
    if (shouldDelete == true) {
        await sleep(DELETETIME)
        msg.delete()
    }
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
    // let counter = 0
    await channel.bulkDelete(amount, true)

    let deletedMsg = await channel.send(data.commands.clear.delmsg.replace("%AMOUNT%", amount))
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
        switch (command.toLowerCase()) {
            case "help":
            case "h":
                {
                    let commands = JSON.parse(await readFile(new URL("./commands.json", import.meta.url)))
                    // check if general help or specific
                    if (contentArray[1] != undefined) {

                        // Check if this command exists
                        if (commands[String(contentArray[1])] != undefined) {
                            let specificComEmbed = await getSpecHelpEmbed(contentArray[1])
                            await channel.send({ embeds: [specificComEmbed] })

                            // Now Search for Alias
                        } else {
                            command = await getCommandByAlias(contentArray[1])
                            if (command != undefined) {
                                let specificComEmbed = await getSpecHelpEmbed(command)
                                await channel.send({ embeds: [specificComEmbed] })

                                // Cant find the command
                            } else {
                                await sendError(channel, "Can't find `" + contentArray[1] + "` as a command\nYou used `" + contentArray[1] + "`")
                                await message.delete()
                            }
                        }
                    } else {
                        let everyoneString = ""
                        let helperString = ""
                        let moderatorString = ""
                        let ownerString = ""

                        for (command in commands) {

                            let permissionArray = commands[String(command)].permissions
                            if (permissionArray.includes('Everyone')) {
                                everyoneString += "`" + command + "`, "
                            } else {
                                if (permissionArray.includes("Helper")) {
                                    helperString += "`" + command + "`, "
                                }
                                if (permissionArray.includes("Moderator")) {
                                    moderatorString += "`" + command + "`, "
                                }
                                if (permissionArray.includes("Owner")) {
                                    ownerString += "`" + command + "`, "
                                }
                            }
                        }

                        let helpEmbed = new MessageEmbed()
                            .setColor("#71368a")
                            .setTitle("Alle Commands für " + client.user.username)
                            .setDescription("- Hier findest du alle Commands des <@" + client.user + ">.\n- Benutze `" + PREFIX + "help <COMMAND>` für weitere Informationen.\n**Prefix:** " + PREFIX)
                            .addFields(
                                { name: "Everyone", value: "- " + everyoneString, inline: false },
                                { name: "Helper", value: "- " + helperString, inline: false },
                                { name: "Moderator", value: "- " + moderatorString, inline: false },
                                { name: "Owner", value: "- " + ownerString, inline: false }
                            )

                        channel.send({ embeds: [helpEmbed] })
                    }
                    break
                }
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
            case "status":
                {
                    if (await checkPermission("status", message.member)) {
                        switch (contentArray[1].toLowerCase()) {
                            case "set":
                                {
                                    let a = contentArray
                                    a.splice(0, 2)
                                    setStatus(a.join(" "))
                                    break
                                }
                            case "start":
                                {
                                    startStatus()
                                    break
                                }
                            case "stop":
                                {
                                    stopStatus()
                                    break
                                }
                            default:
                                {
                                    sendError(channel, "You parameter, `" + contentArray[1] + "` can not be used.")
                                    message.delete()
                                }

                        }
                    } else {
                        await sendWarn(channel, data.messages.permission)
                    }
                    break
                }
            case "blacklist":
            case "bl":
                {
                    if (await checkPermission("blacklist", message.member)) {
                        var blacklist = JSON.parse(await readFile(new URL("./blacklist.json", import.meta.url)))
                        switch (contentArray[1].toLowerCase()) {
                            case "add":
                                {
                                    let a = contentArray
                                    a.splice(0, 2)
                                    if (!a.join(" ") == "" || !a.join(" ") == " ") {
                                        if (!blacklist.includes(a.join(" "))) {
                                            blacklist.push(a.join(" "))
                                            blacklist.sort()

                                            let jsonData = JSON.stringify(blacklist, null, 4)
                                            await writeFile("blacklist.json", jsonData)
                                            sendInfo(channel, "Added `" + a.join(" ") + "` to the blacklist.", false)
                                        } else {
                                            sendWarn(channel, "This word/or phrase is already blacklisted.")
                                            message.delete()
                                        }
                                    } else {
                                        sendError(channel, "You need to define a word/phrase ")
                                        message.delete()
                                    }
                                    break
                                }
                            case "remove":
                                {
                                    var index = contentArray[2]
                                    if (isNaN(index) == true) {
                                        index = blacklist.indexOf(index)
                                    } else {
                                        index -= 1
                                    }
                                    let test = blacklist.splice(Number(index), 1)
                                    blacklist.sort()

                                    let jsonData = JSON.stringify(blacklist, null, 4)
                                    await writeFile("blacklist.json", jsonData)
                                    sendInfo(channel, "Removed `" + test + "` from the blacklist.")
                                    break
                                }
                            case "list":
                                {
                                    let desc = ""

                                    for (let item of blacklist) {
                                        desc += "• `" + item + "`\n"
                                    }
                                    let blacklistEmbed = new MessageEmbed()
                                        .setColor("#a10906")
                                        .setTitle("List of all blacklisted words.")
                                        .setDescription(desc)
                                    channel.send({ embeds: [blacklistEmbed] })

                                    break
                                }
                            default:
                                {
                                    sendError(channel, "You parameter, `" + contentArray[1] + "` can not be used.")
                                    message.delete()
                                }

                        }
                    } else {
                        await sendWarn(channel, data.messages.permission)
                        message.delete()
                    }
                    break
                }
            default: {
                console.log("command not found");
                sendError(channel, "No Command `" + command + "` not found")
                message.delete()
            }
        }
    }
})

// Moderation to check messages for bad content
client.on("messageCreate", async (message) => {
    var blacklist = JSON.parse(await readFile(new URL("./blacklist.json", import.meta.url)))
    for (let item of blacklist) {
        if (message.content.toLowerCase().includes(item.toLowerCase()) && await checkPermission("blacklist", message.member) != true && message.author.bot == false) {
            message.delete()
            message.member.send(data.moderation.blacklist.warnmsg.replace("%WORD%", item))
            break
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