const { setTimeout } = require("discord.js")

export async function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}