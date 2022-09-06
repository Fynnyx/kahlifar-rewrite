const { writeFile } = require("fs");
const { disableButtons } = require('../helpers/components.js');
const { getIdFromString } = require('../helpers/getIdFromString.js');
const { sendError, sendInfo } = require('../helpers/send.js');
const { verifyMember } = require('../helpers/verify.js');
const { isBanned, banUser } = require('../helpers/modmail.js');
const { logToModConsole } = require('../helpers/logToModConsole.js');
const client = require('../index.js');
const { MessageEmbed } = require("discord.js");
const logger = require("../handlers/logger.js");
const data = require(`${process.cwd()}/properties.json`)
const modmailData = require(`${process.cwd()}/modmail.json`)


client.on('interactionCreate', async interaction => {
	// console.log(interaction);
	// DONT CHANGE THIS CODE
	// It calls the right SlashCommand run function.
	if (interaction.isCommand()) {
		// await interaction.deferReply({ ephemeral: false }).catch(() => { });

		const cmd = client.slashCommands.get(interaction.commandName);
		if (!cmd)
			return interaction.reply({ content: "An error has occured " });

		const args = [];

		for (let option of interaction.options.data) {
			if (option.type === "SUB_COMMAND") {
				if (option.name) args.push(option.name);
				option.options?.forEach((x) => {
					if (x.value) args.push(x.value);
				});
			} else if (option.value) args.push(option.value);
		}
		interaction.member = interaction.guild.members.cache.get(interaction.user.id);

		cmd.run(client, interaction, args);
	}


	// --> Here you can go on.
	if (interaction.isSelectMenu()) {
		switch (interaction.customId) {
			case "replace":
				break

			default:
				sendError(interaction, "I cant find running code for this interaction.", true, true);
				console.info("I dont know what to do. Something missing?");
		}
	}

	if (interaction.isButton()) {
		switch (interaction.customId) {
			case "modmailconfirmation":
				interaction.message.edit({ components: [await disableButtons(interaction.message.components)] });
				break;
			case "modmaildeny":
				interaction.message.edit({ components: [await disableButtons(interaction.message.components)] });
				interaction.reply({ content: "📨 - Mail **hasn't** been sent.", ephemeral: true });
				break;

			case "verify":
				verifyMember(interaction);
				break

			case "modmailreply":
				interaction.reply({ content: "Write your reply to the chat to reply.", ephemeral: true });
				var mailmsg = interaction.message
				let replyFilter = (message) => message.author.id === interaction.user.id;
				interaction.channel.awaitMessages({ filter: replyFilter, max: 1, time: 60000, errors: ['time'] })
					.then(async (collected) => {
						message = collected.first();
						let id = await getIdFromString(interaction.message.embeds[0].description)
						const user = await client.users.fetch(id)
						user.send(`Reply received ` + message.content)
						sendInfo(message, `Send Reply to <@${user.id}> with the content\n\n${message.content}`, true, false);
						message.delete();
						mailmsg.edit({ components: [await disableButtons(mailmsg.components)] });
					}).catch((e) => {
						logger.error(e)
					})
				break
			case "modmailspam":
				let id = await getIdFromString(interaction.message.embeds[0].description)
				await banUser(id)
				sendInfo(interaction, `User <@${id}> has been banned from using modmail.`, true, false);
				interaction.message.edit({ components: [await disableButtons(interaction.message.components)] });
				await logToModConsole("Modmail Ban", `User <@${id}> has been banned from using modmail.`, data.helpers.send.colors.info)
				break
			case "modmaildelete":
				interaction.message.delete();
				break;

			default:
				sendError(interaction, "I cant find running code for this interaction.", true, true);
				console.info("I dont know what to do. Something missing?");
		}
	}

});



