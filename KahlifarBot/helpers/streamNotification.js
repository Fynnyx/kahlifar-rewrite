const axios = require('axios');
const { writeFileSync } = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getOAuthToken } = require('./twitch')
const client = require('../index');
const data = require('../properties.json');
const streamerData = require('../streamer.json');
const logger = require('../handlers/logger');

let jwt = null

const requestData = {
    headers: {
        'Client-ID': process.env.CLIENTID,
        'Authorization': `Bearer ${jwt}`
    }
}

exports.startNotifications = async () => {
    const notificationInterval = setInterval(async () => {
        try {
            const jwt = await getOAuthToken()
            requestData.headers.Authorization = `Bearer ${jwt}`
            streamerData.streamer.forEach(async streamer => {
                try {
                    var index = streamerData.streamer.indexOf(streamer);

                    if (await checkIsLive(streamer.name)) {
                        const streamData = await getStreamData(streamer.name)
                        if (streamData === undefined) {
                            return logger.info("StreamerData is undefined")
                        }
                        const streamFollower = await getStreamFollower(streamData.user_id)
                        const channelData = await getChannelData(streamData.user_id)

                        if (streamer.lastStreamId !== streamData.id) {
                            streamerData.streamer[index].lastStreamId = streamData.id

                            const JSONData = JSON.stringify(streamerData, null, 2)
                            writeFileSync('./streamer.json', JSONData)

                            const startDate = new Date(streamData.started_at)
                            const startedString = `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}\n${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`

                            var notEmbed = new MessageEmbed()
                                .setTitle(`🔴 - ${streamData.user_name} streamt ${streamData.game_name}`)
                                .setURL(`https://twitch.tv/${streamData.user_login}`)
                                .setDescription(`Schaue gerne bei - **${streamData.title}** - rein.`)

                                .setColor("#422780")
                                .setThumbnail(channelData.profile_image_url)
                                .setImage(streamData.thumbnail_url.replace("{width}", '320').replace("{height}", '180'))
                                .setFields(
                                    {
                                        name: "Gestartet um:",
                                        value: `${startedString}`,
                                        inline: true
                                    },
                                    {
                                        name: "Sprache:",
                                        value: `${streamData.language}`,
                                        inline: true
                                    },
                                    {
                                        name: "-------------------------",
                                        value: "\u200b",
                                        inline: false
                                    },
                                    {
                                        name: "Follower:",
                                        value: `${streamFollower.total}`,
                                        inline: true
                                    },
                                    {
                                        name: "Subscriber",
                                        value: `*cant be resolved*`,
                                        inline: true

                                    }
                                )

                            let row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setURL(`https://twitch.tv/${streamData.user_login}`)
                                        .setLabel(`Visit ${streamData.user_name}`)
                                        .setStyle('LINK')
                                )


                            let channel = await client.channels.fetch(data.helpers.streamerNotification.notificationChannel)
                            channel.send({ content: `<@&${data.helpers.streamerNotification.notificationRole}>`, embeds: [notEmbed], components: [row] })

                        } else {
                            // let channel = await client.channels.fetch(data.helpers.streamerNotification.notificationChannel)
                        }
                    }
                } catch (error) {
                    logger.error(error)
                }
            })
        } catch (e) {
            logger.error(e)
        }
    }, data.helpers.streamerNotification.intervalMinutes * 60 * 1000);
}

async function checkIsLive(streamerName) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, requestData)
        if (response.data.data.length > 0) {
            return true
        } else {
            return false
        }
    } catch (e) {
        logger.error("Error in checkIsLive\n" + e)
    }
}

async function getStreamData(streamerName) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, requestData)
        return response.data.data[0]
    } catch (e) {
        logger.error("Error in getStreamData\n" + e)
    }
}

async function getStreamFollower(streamerId) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${streamerId}`, requestData)
        return response.data
    } catch (e) {
        logger.error("Error in getStreamFollower\n" + e)
    }
}

async function getChannelData(channelId) {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users?id=${channelId}`, requestData)
        return response.data.data[0]
    } catch (e) {
        logger.error("Error in getChannelData\n" + e)
    }
}