const { MessageEmbed, MessageSelectMenu } = require("discord.js");

exports.getEmbedFromJSON = async (filePath) => {
    const embedData = require(filePath)
    const embed = new MessageEmbed()
        .setTitle(embedData.title)
        .setDescription(embedData.description)
        .setColor(embedData.color)
        embedData.fields.map((field) => {
            embed.addFields({ name: field.name, value: field.value, inline: field.inline})
        })
        
    return embed;
}

exports.getSelectFromJSON = async (filePath) => {
    const selectData = require(filePath)
    const select = new MessageSelectMenu()
        .setCustomId(selectData.customId)
        .setPlaceholder(selectData.placeholder)
        .addOptions(selectData.options)
        if (selectData.maxValues != null) select.maxValues = selectData.maxValues;
        if (selectData.minValues != null) select.minValues = selectData.minValues;
        
    return {select: select, message: selectData.message};
}