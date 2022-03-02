const { MessageActionRow } = require('discord.js')

exports.disableButtons = async (components) => {
    var row  = new MessageActionRow()

    for (var component of components[0].components) {
        component.setDisabled(true);
        row.addComponents(component);
    }

    return row;
}