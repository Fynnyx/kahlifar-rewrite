const { logToModConsole } = require('../helpers/logToModConsole.js');
const client = require('../index.js');
const data = require(`${process.cwd()}/properties.json`)


client.on('messageDelete', async (message) => {
	// Ignore direct messages
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const deletionLog = fetchedLogs.entries.first();
    if (message.author === null) return;
	if (message.author.bot) return;

	// Perform a coherence check to make sure that there's *something*
	if (!deletionLog) return logToModConsole("🗑 - Message deleted", `A message by ${message.author.tag} was deleted, but no relevant audit logs were found.\n\n**Message Content**\n${message.content}\n\n**Message Channel**\n${message.channel}`, data.helpers.send.colors.warning);

	// Now grab the user object of the person who deleted the message
	// Also grab the target of this action to double-check things
	const { executor, target } = deletionLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same author's message
	if (target.id === message.author.id) {
		logToModConsole("🗑 - Message deleted", `A message by ${message.author.tag} was deleted by ${executor.tag}.\n\n**Message Content**\n${message.content}\n\n**Message Channel**\n${message.channel}`, data.helpers.send.colors.warning);
	} else {
		logToModConsole("🗑 - Message deleted", `A message by ${message.author.tag} was deleted, but we don't know by who.\n\n**Message Content**\n${message.content}\n\n**Message Channel**\n${message.channel}`, data.helpers.send.colors.warning);
	}
});



