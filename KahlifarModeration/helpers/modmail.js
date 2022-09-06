const { readFileSync, writeFile } = require("fs")
const { MessageEmbed } = require("discord.js")
const client = require("../index.js")
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
        writeFile("./modmail.json", JSON.stringify(banlist), (err) => {
            if (err) console.log(err)
        })
        const bannInfoEmbed = new MessageEmbed()
            .setDescription("**You have been banned from using Modmail.**")
            .setColor(data.helpers.send.colors.info)

        await user.send({ embeds: [bannInfoEmbed] })
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
        writeFile("./modmail.json", JSON.stringify(banlist), (err) => {
            if (err) console.log(err)
        })
        const bannInfoEmbed = new MessageEmbed()
            .setDescription("**You have been unbanned from Modmail.**")
            .setColor(data.helpers.send.colors.info)

        await user.send({ embeds: [bannInfoEmbed] })
        return `Successfully unbanned ${user.tag} from the Modmail System.`
    } else {
        return `The user ${user.tag} is not banned from the Modmail System.`
    }
}