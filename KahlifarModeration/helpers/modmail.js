const { readFileSync, writeFile } = require("fs")
const { MessageEmbed } = require("discord.js")
const client = require("../index.js")
const { logToModConsole } = require("./logToModConsole.js")
const data = require(`${process.cwd()}/properties.json`)

exports.isBanned = async (id) => {
    const banlist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (banlist.banlist.includes(`${id}`)) {
        return true
    }
    return false
}

exports.banUser = async (id) => {
    const user = await client.users.fetch(id)
    const banlist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (!await this.isBanned(id)) {
        banlist.banlist.push(`${id}`)
        writeFile("./modmail.json", JSON.stringify(banlist, null, 4), (err) => {
            if (err) console.log(err)
        })
        const bannInfoEmbed = new MessageEmbed()
            .setDescription("**You have been banned from using Modmail.**")
            .setColor(data.helpers.send.colors.info)

        await user.send({ embeds: [bannInfoEmbed] })
        await logToModConsole("Modmail Ban", `<@${user.id}> has been **banned** from using modmail.`, data.helpers.send.colors.info)
        return `Successfully banned ${user.tag} from the Modmail System.`
    } else {
        return `The user ${user.tag} is already banned from the Modmail System.`
    }
}

exports.unbanUser = async (id) => {
    const user = await client.users.fetch(id)
    const banlist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (await this.isBanned(id)) {
        banlist.banlist.splice(banlist.banlist.indexOf(`${id}`), 1)
        writeFile("./modmail.json", JSON.stringify(banlist, null, 4), (err) => {
            if (err) console.log(err)
        })
        const bannInfoEmbed = new MessageEmbed()
            .setDescription("**You have been unbanned from Modmail.**")
            .setColor(data.helpers.send.colors.info)

        await user.send({ embeds: [bannInfoEmbed] })
        await logToModConsole("Modmail Unban", `<@${user.id}> has been **unbanned** from using modmail.`, data.helpers.send.colors.info)
        return `Successfully unbanned ${user.tag} from the Modmail System.`
    } else {
        return `The user ${user.tag} is not banned from the Modmail System.`
    }
}

exports.isReplying = async (id) => {
    const replylist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (replylist.replylist.includes(`${id}`)) {
        return true
    }
    return false
}

exports.addReplyUser = async (id) => {
    const replylist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (!await this.isReplying(id)) {
        replylist.replylist.push(`${id}`)
        writeFile("./modmail.json", JSON.stringify(replylist, null, 4), (err) => {
            if (err) console.log(err)
        })
    }
}

exports.removeReplyUser = async (id) => {
    const replylist = JSON.parse(readFileSync("./modmail.json", "utf8"))
    if (await this.isReplying(id)) {
        replylist.replylist.splice(replylist.replylist.indexOf(`${id}`), 1)
        writeFile("./modmail.json", JSON.stringify(replylist, null, 4), (err) => {
            if (err) console.log(err)
        })
    }
}