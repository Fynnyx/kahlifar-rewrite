const { readFileSync } = require('fs');
const { sendError } = require('../helpers/send.js');
const { checkUsername } = require('../helpers/minecraft.js');
const { getIdFromString } = require('../helpers/bewerbung.js');
const client = require('../index.js');
const data = require(`${process.cwd()}/properties.json`)


client.on('interactionCreate', async interaction => {
	// console.info(interaction);
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
			case "games":
			case "pingroles":
			case "ageroles":
				interaction.component.options.map(role => {
					let removerole = interaction.guild.roles.cache.get(role.value);
					// remove role from member
					interaction.member.roles.remove(removerole)
				})
				interaction.values.map(option => {
					let addrole = interaction.guild.roles.cache.get(option);
					// add role to member
					interaction.member.roles.add(addrole);
				})
				interaction.reply({ content: "Roles updated", ephemeral: true });
				break

			default:
				sendError(interaction, "I cant find running code for this interaction.", true, true);
				console.info("I dont know what to do. Something missing?");
		}
	}

	if (interaction.isButton()) {
		switch (interaction.customId) {
			case "bew-accept":
				getIdFromString(interaction.message.embeds[0].description).then( async id => {
					let member = interaction.guild.members.cache.get(id);
					let role = interaction.guild.roles.cache.get(data.commands.bewerbung.role);
					let mcChannel = interaction.guild.channels.cache.get(data.commands.bewerbung.mcChannel);
					let username = interaction.message.embeds[0].footer.text
					let mcData = await checkUsername(username)
					if (mcData == undefined) {
						sendError(interaction, "The username is not valid.", true, true);
						return;
					} else {
						member.roles.add(role);
						member.send(data.commands.bewerbung.messages.accept);

						mcChannel.send(`whitelist add ${interaction.message.embeds[0].footer.text}`)

						interaction.message.delete();
						interaction.reply({ content: "✅Bewerbung akzeptiert", ephemeral: true });
					}
				})
				break

			case "bew-decline":
				getIdFromString(interaction.message.embeds[0].description).then(id => {
					let member = interaction.guild.members.cache.get(id);
					member.send(data.commands.bewerbung.messages.deny)
				})
				interaction.message.delete();
				interaction.reply({ content: "❌Bewerbung abgelehnt", ephemeral: true });

				break

			case "bew-help":
				let message = readFileSync(`${process.cwd()}/assets/texts/bewerbungHelp.txt`, "utf-8")
				interaction.reply({ content: message, ephemeral: true });
				break

			default:
				sendError(interaction, "I cant find running code for this interaction.", true, true);
				console.info("I dont know what to do. Something missing?");
		}
	}

});



