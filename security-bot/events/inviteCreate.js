const client = require('../index.js');
const data = require(`${process.cwd()}/properties.json`)


client.on('inviteCreate', async invite => {
    invite.inviter.send("Please use <http://discord.kahlifar.de> to join the server.");
    invite.delete();
});



