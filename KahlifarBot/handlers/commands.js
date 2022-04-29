const { glob } = require("glob")
const { promisify } = require("util")
const globPromise = promisify(glob)
const logger = require("../handlers/logger")

const { Client } = require("discord.js")

/**
 * 
 * @param { Client } client 
 */

// Register all SlashCOmmands declared in ../commands
module.exports = async (client) => {
    try {
        const slashCommands = await globPromise(
            `${process.cwd()}/commands/*/*.js`
        );

        const arrayOfSlashCommands = [];
        slashCommands.map((value) => {
            const file = require(value);
            if (!file?.name) return;
            client.slashCommands.set(file.name, file);

            if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
            if (file.userPermissions) file.defaultPermission = false;
            arrayOfSlashCommands.push(file);
        });
        client.on("ready", async () => {
            // -- Register for a single guild
            const guild = client.guilds.cache.get("814230131681132605")
            await guild.commands.set(arrayOfSlashCommands)
        });
    } catch (e) {
        logger.error(e)
    }
}