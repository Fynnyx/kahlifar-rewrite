import { config } from "dotenv";
import { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, ReactionCollector, Presence } from "discord.js";
import { readFile, readdir } from 'fs/promises'
import { resolve } from "path";

config();

const data = JSON.parse(await readFile(new URL("./properties.json", import.meta.url)))

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
})

const PREFIX = data.prefix
const DELETETIME = data.deletetime

// ON READY ----------------------------------
client.on("ready", () => {
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

client.on("messageCreate", async (message) => {
    // console.log(message)
    let channel = message.channel
    if (message.content.startsWith(PREFIX)) {
        let content = message.content.replace(PREFIX, "");
        let contentArray = content.split(" ");
        let command = contentArray[0]

        console.log(command);

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
                            console.log("TEst ", command);
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

            case "discord-link":
            case "discord":
            case "dc":
                {
                    let linkMsg = ""
                    for (let link of data.commands.discord.links) {
                        linkMsg += "<" + link + ">\n"
                    }
                    channel.send("**Links zum einladen deiner Freunde:**\n" + linkMsg)
                    break
                }

            case "server-ip":
            case "server":
            case "ip":
                {
                    channel.send("**Die Minecraft Server IP:**\n->  " + data.commands.server.ip)
                    break
                }

            case "send":
                {
                    if (await checkPermission("send", message.member)) {
                        let assetsPath = "./assets/texts/"
                        let files = await readdir("./assets/texts/")
                        console.log(contentArray[1] + ".txt");
                        if (files.includes(contentArray[1] + ".txt")) {
                            let file = contentArray[1] + ".txt"
                            let fileContent = await readFile(assetsPath + file, 'utf8')
                            // fetchedMessages = await channel.fetchMessages({limit: 100})
                            await channel.bulkDelete(20, false)
                            await channel.send(fileContent)
                        } else if (files.includes(contentArray[1] + ".json")) {

                        }
                    } else {
                        await sendWarn(channel, "Permission denied. Ask the Owner.")
                        message.delete()
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


client.on('guildMemberAdd', member => {
    member.guild.channels.get(data.events.join.channel).send(`Hey, ${member} Willkommen auf dem Kahlifar Discord \ud83c\udf86.\nUm mit diesem Discord zu interagieren musst du dich im <#895385320848236574>-Channel verifizieren.\nIm <#835629559645995009>-Channel bekommst du Inforamtionen \u00fcber diesen Discord und wie er funktioniert. Begib dich doch dorthin und entdecke es selber\ud83d\uddfa\ufe0f.`); 
});


client.login(process.env.TOKEN);