const { getIdFromString } = require('../helpers/getIdFromString.js');
const { sendError } = require('../helpers/send.js');
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
			case "modmaildeny":
				return

			case "verify":
				verifyMember(interaction);
				break

			case "modmailreply":
				break

			case "modmailspam":
				interaction.reply({ content: "For how long should the user be banned? (1s, 1m, 1h, 1d, 1w, 1M, 1y)", ephemeral: true });
				let filter = (message) => message.author.id == interaction.user.id
				interaction.channel.awaitMessages(filter, { time: 10000, errors: ['time'] })
					.then(async (message) => {
						console.log(message);
						console.log(m);
						interaction.message.delete();
						let id = await getIdFromString(interaction.message.embeds[0].description)
						client.users.fetch(id).then(async (user) => {
							let time = message.content;
							await user.send(`You have been banned from the modmail for ${time} because you have been spamming.`)
							interaction.reply("User put on blacklist.");
						})
							.catch((e) => {
								console.error(e);
							})
					})
					.catch((e) => {
						console.error(e)
					})
				break

			default:
				sendError(interaction, "I cant find running code for this interaction.", true, true);
				console.info("I dont know what to do. Something missing?");
		}
	}

});



