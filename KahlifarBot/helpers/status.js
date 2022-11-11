const client = require("../index.js")
const {checkIsLive, getStreamData} = require("./twitch.js")
const statusList = require(`${process.cwd()}/status.json`)
const data = require(`${process.cwd()}/properties.json`)
const logger = require("../handlers/logger")

let statusInterval = {
    _destroyed: true
};

exports.startStatus = async () => {
    if (statusInterval._destroyed) {
        statusInterval = setInterval(() => {
            try {
                const statues = statusList
                let currentStatus = statues.indexOf(client.user.presence.activities[0].name);
                let index = Math.floor(Math.random() * (statues.length))
                while (currentStatus == index) {
                    index = Math.floor(Math.random() * (statues.length))
                }
                let status = statues[index]
                client.user.setActivity({ name: status.value, type: status.type })
            } catch (e) {
                logger.error(e)
            }
        }, data.commands.status.time * 1000)
    }
}


exports.stopStatus = async () => {
    clearInterval(statusInterval)
    client.user.setActivity(data.commands.status.default)
}


exports.setStatus = async (message, type="PLAYING") => {
    clearInterval(statusInterval)
    client.user.setActivity(message, { type: type })
}

exports.setStreamStatus = async () => {
    try {
        if (await checkIsLive(data.commands.status.kahlifarTwitch)) {
            const streamData = await getStreamData(data.commands.status.kahlifarTwitch)
            this.stopStatus()
            client.user.setActivity({ name: `${streamData.title} | ${streamData.viewer_count }`, type: "STREAMING", url: `https://twitch.tv/${data.commands.status.kahlifarTwitch}` })
        } else {
            this.startStatus()
        }
    } catch (e) {
        logger.error(e)
    }
}

exports.startStreamStatus = async () => {
    this.setStreamStatus()
    const streamStatusInterval = setInterval(async () => {
        await this.setStreamStatus()
    }, data.commands.status.streamCheckTime * 1000 * 60)
}