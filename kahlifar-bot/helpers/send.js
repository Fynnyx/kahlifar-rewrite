const { MessageEmbed } = require("discord.js");
const { sleep } = require(`${process.cwd()}/helpers/sleep.js`)
const data = require(`${process.cwd()}/properties.json`)

exports.sendError = async (message, content, doDelete, ephemeral) => {
    var msg = {}
    let errorEmbed = new MessageEmbed()
        .setColor(data.helpers.send.colors.error)
        .setTitle(data.helpers.send.prefixTitle.error)
        .setDescription(content)
    if (message.type == "APPLICATION_COMMAND" || message.type == "MESSAGE_COMPONENT") {
        if (message.deferred) {
            msg = message.editReply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        } else {
            msg = await message.reply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        }
    } else {
        msg = await message.channel.send({ embeds: [errorEmbed], fetchReply: true })
    }
    if (doDelete && !ephemeral) {
        await sleep(data.deleteTime)
        msg.delete()
    }
}


exports.sendInfo = async (message, content, doDelete, ephemeral) => {
    var msg = {}
    let infoEmbed = new MessageEmbed()
        .setColor(data.helpers.send.colors.info)
        .setTitle(data.helpers.send.prefixTitle.info)
        .setDescription(content)
    if (message.type == "APPLICATION_COMMAND" || message.type == "MESSAGE_COMPONENT") {
        if (message.deferred) {
            msg = message.editReply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        } else {
            msg = await message.reply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        }
    } else {
        msg = await message.channel.send({ embeds: [infoEmbed], fetchReply: true })
    }
    if (doDelete && !ephemeral) {
        await sleep(data.deleteTime)
        msg.delete()
    }
}


exports.sendWarn = async (message, content, doDelete, ephemeral) => {
    var msg = {}
    let errorEmbed = new MessageEmbed()
        .setColor(data.helpers.send.colors.warning)
        .setTitle(data.helpers.send.prefixTitle.warning)
        .setDescription(content)
    if (message.type == "APPLICATION_COMMAND" || message.type == "MESSAGE_COMPONENT") {
        if (message.deferred) {
            msg = message.editReply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        } else {
            msg = await message.reply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        }
    } else {
        msg = await message.channel.send({ embeds: [errorEmbed], fetchReply: true })
    }
    if (doDelete && !ephemeral) {
        await sleep(data.deleteTime)
        msg.delete()
    }
}


exports.sendSuccess = async (message, content, doDelete, ephemeral = false) => {
    var msg = {}
    let errorEmbed = new MessageEmbed()
        .setColor(data.helpers.send.colors.success)
        .setTitle(data.helpers.send.prefixTitle.success)
        .setDescription(content)
    if (message.type == "APPLICATION_COMMAND" || message.type == "MESSAGE_COMPONENT") {
        if (message.deferred) {
            msg = message.editReply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        } else {
            msg = await message.reply({ embeds: [errorEmbed], fetchReply: true, ephemeral: ephemeral })
        }
    } else {
        msg = await message.channel.send({ embeds: [errorEmbed], fetchReply: true })
    }
    if (doDelete && !ephemeral) {
        if (!msg.deletable) return;
        await sleep(data.deleteTime)
        msg.delete()
    }
}