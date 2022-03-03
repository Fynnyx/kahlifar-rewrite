const { disableButtons } = require('../helpers/components.js');
const { getIdFromString } = require('../helpers/getIdFromString.js');
const { sendError, sendInfo } = require('../helpers/send.js');
const { verifyMember } = require('../helpers/verify.js');
const client = require('../index.js');
const data = require(`${process.cwd()}/properties.json`)


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
						client.users.fetch(id)
							.then(async (user) => {
								user.send(`Reply received ` + message.content)
								sendInfo(message, `Send Reply to <@${user.id}> with the content\n\n${message.content}`, true, false);
								message.delete();
								mailmsg.edit({ components: [await disableButtons(mailmsg.components)] });

							})
							.catch((e) => {
								console.error(e);
							})
					})
					.catch((e) => {
						console.error(e)
					})
				break

				break

			case "modmailspam":
				interaction.reply({ content: "For how long should the user be banned? (1s, 1m, 1h, 1d, 1w, 1M, 1y)", ephemeral: true });
				let filter = (message) => message.author.id === interaction.user.id;
				// console.log(interaction.channel);
				interaction.channel.awaitMessages({ filter: filter, max: 1, time: 5000, errors: ['time'] })
					.then(async (collected) => {
						message = collected.first();
						let id = await getIdFromString(interaction.message.embeds[0].description)
						client.users.fetch(id)
							.then(async (user) => {
								let time = message.content;
								user.send(`You have been banned from the modmail for **${time}** because you have been spamming.`)
								sendInfo(message, `**${user.tag}** has been banned from the modmail for **${time}** because he has been spamming.`);
							})
							.catch((e) => {
								console.error(e);
							})
					})
					.catch((e) => {
						console.error(e)
					})
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



