const axios = require('axios');
const { writeFileSync } = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = require('../index');
const data = require('../properties.json');
const streamerData = require('../streamer.json');
const logger = require('../handlers/logger');



const requestData = {
    headers: {
        'Client-ID': process.env.CLIENTID
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
                        const streamFollwer = await getStreamFollower(streamData.user_id)
                        const channelData = await getChannelData(streamData.user_id)

                        if (streamer.lastStreamId !== streamData.id) {
                            streamerData.streamer[index].lastStreamId = streamData.id

                            const JSONData = JSON.stringify(streamerData, null, 2)
                            writeFileSync('./streamer.json', JSONData)

                            const startDate = new Date(streamData.started_at)
                            const startedString = `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}\n${startDate.getDate()}.${startDate.getMonth()+1}.${startDate.getFullYear()}`

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
                                        value: `${streamFollwer.total}`,
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


async function getOAuthToken() {
    const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&grant_type=client_credentials`, requestData)
    return response.data.access_token
}

async function checkIsLive(streamerName) {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, requestData)
    if (response.data.data.length > 0) {
        return true
    } else {
        return false
    }
}

async function getStreamData(streamerName) {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, requestData)
    return response.data.data[0]
}

async function getStreamFollower(streamerId) {
    const response = await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${streamerId}`, requestData)
    return response.data
}

async function getChannelData(channelId) {
    const response = await axios.get(`https://api.twitch.tv/helix/users?id=${channelId}`, requestData)
    return response.data.data[0]
}