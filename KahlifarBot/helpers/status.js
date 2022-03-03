const client = require("../index.js")
const data = require(`${process.cwd()}/properties.json`)



exports.startStatus = async () => {
    const status = data.commands.status.statusList
    client.user.setActivity(status[0])
    
    statusInterval = setInterval(() => {
        const statues = data.commands.status.statusList
        let currentStatus = statues.indexOf(client.user.presence.activities[0].name);
        let index = Math.floor(Math.random() * (statues.length))
        while (currentStatus == index) {
            index = Math.floor(Math.random() * (statues.length))
        }
        client.user.setActivity(statues[index])
    }, data.commands.status.time * 1000)
}


exports.stopStatus = async () => {
    clearInterval(statusInterval)
    client.user.setActivity(data.commands.status.default)
}


exports.setStatus = async (message) => {
    clearInterval(statusInterval)
    client.user.setActivity(message)
}