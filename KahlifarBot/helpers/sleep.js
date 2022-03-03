// const { setTimeout } = require("discord.js")
const { setTimeout } = require("timers")

exports.sleep = async (seconds) => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}