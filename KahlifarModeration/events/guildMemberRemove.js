const { MessageEmbed } = require('discord.js');
const { logToModConsole } = require('../helpers/logToModConsole.js');
const client = require('../index.js');
const data = require(`${process.cwd()}/properties.json`)


client.on('guildMemberRemove', async member => { 
    logToModConsole("", `**${member.user.tag} has left the server.**`, data.helpers.send.colors.error)
    
});



