const { readFileSync } = require('fs');
const { sendError, sendSuccess } = require('../helpers/send.js');
const { checkUsername } = require('../helpers/minecraft.js');
const { getIdFromString } = require('../helpers/bewerbung.js');
const client = require('../index.js');
const { default: axios } = require('axios');
const logger = require('../handlers/logger');
const data = require(`${process.cwd()}/properties.json`)


client.on('interactionCreate', async interaction => {
	try {
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
				case "bew-mc-accept":
					getIdFromString(interaction.message.embeds[0].description).then(async id => {
						let member = interaction.guild.members.cache.get(id);
						let role = interaction.guild.roles.cache.get(data.commands.bewerbung.mc.role);
						let mcChannel = interaction.guild.channels.cache.get(data.commands.bewerbung.mc.mcChannel);
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

				case "bew-mc-decline":
					getIdFromString(interaction.message.embeds[0].description).then(id => {
						let member = interaction.guild.members.cache.get(id);
						member.send(data.commands.bewerbung.messages.deny)
					})
					interaction.message.delete();
					interaction.reply({ content: "❌Bewerbung abgelehnt", ephemeral: true });

					break

				case "bew-ark-accept":
					getIdFromString(interaction.message.embeds[0].description).then(async id => {
						let member = interaction.guild.members.cache.get(id);
						let role = interaction.guild.roles.cache.get(data.commands.bewerbung.ark.role);
						member.roles.add(role);
						member.send(data.commands.bewerbung.messages.accept);

						interaction.message.delete();
						interaction.reply({ content: "✅Bewerbung akzeptiert", ephemeral: true });
					})
					break

				case "bew-ark-decline":
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

				case "server-start":
					await interaction.deferReply();
					const startResponse = await axios.get("https://webi.freakside-world.eu//memberrequest.php?op=api&ids=1&hash=5765177554a3faa430a28176051dc471&hkey=f6cb75eb3933ab341637aba223ca6a3f")
					if (startResponse.data.includes("ok")) {
						sendSuccess(interaction, "Server wurde gestartet", false, true);
					} else {
						sendError(interaction, "Server konnte nicht gestartet werden", false, true);
					}
					break

				case "server-stop":
					await interaction.deferReply();
					const stopResponse = await axios.get("https://webi.freakside-world.eu//memberrequest.php?op=api&ids=2&hash=ed17e24957ba9b47b5d31b4d474387e3&hkey=45cc213813a243f2e4617574eaa63ba0")
					if (stopResponse.data.includes("ok")) {
						sendSuccess(interaction, "Server wurde gestoppt", false, true);
					} else {
						sendError(interaction, "Server konnte nicht gestoppt werden", false, true);
					}
					break

				default:
					sendError(interaction, "I cant find running code for this interaction.", true, true);
					console.info("I dont know what to do. Something missing?");
			}
		}
	} catch (error) {
		logger.error(error);
	}
});



