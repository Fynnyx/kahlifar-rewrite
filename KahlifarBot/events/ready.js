const client = require("../index.js")
const { startStatus } = require("../helpers/status.js")
const { startNotifications } = require("../helpers/streamNotification.js")
const logger = require("../handlers/logger")
const { startVideoNotifications } = require("../helpers/videoNotification.js")
const axios = require("axios")


client.on("ready", async () => {
    try {
        client.user.setActivity(`Starting...`)
        console.info(`Starting status task`)
        startStatus()
        console.info(`Starting stream notification task`)
        startNotifications()
        // console.info("Starting video notification task");
        // startVideoNotifications()
        console.info(`\x1b[33m${client.user.username}\x1b[34m, logged in\x1b[0m`)
    } catch (e) {
        logger.error(e)
    }
})