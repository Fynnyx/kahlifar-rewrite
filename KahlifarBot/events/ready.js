const client = require("../index.js")
const { startStatus } = require("../helpers/status.js")
const { startNotifications } = require("../helpers/streamNotification.js")
const logger = require("../handlers/logger")


client.on("ready", () => {
    try {
        console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
        client.user.setActivity(`Starting...`)
        startStatus()
        startNotifications()
    } catch (e) {
        logger.error(e)
    }
})