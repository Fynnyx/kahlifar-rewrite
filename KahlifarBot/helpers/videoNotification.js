const axios = require('axios');
const { writeFileSync } = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = require('../index');
const data = require('../properties.json');
const videoChannels = require('../videoChannels.json');
const logger = require('../handlers/logger');

exports.startVideoNotifications = async () => {
    const videoNotificationInterval = setInterval(async () => {
        // try {
            // const jwtkey = await getOAuthToken();
            videoChannels.channels.forEach(async channel => {
                // try {
                    const index = videoChannels.channels.indexOf(channel);
                    console.log("Checking for new videos from " + channel.id);
                    console.log(await checkHasNewVideo(channel));
                    if (await checkHasNewVideo(channel)) {
                        const newVideos = await getNewVideos(channel);
                        const channelData = await getChannelData(channel.id);
                        for (video of newVideos) {
                            const publishedDate = new Date(video.snippet.publishedAt);
                            const publishedDateString = `${publishedDate.getHours()}:${publishedDate.getMinutes()}:${publishedDate.getSeconds()}\n${publishedDate.getDate()}.${publishedDate.getMonth() + 1}.${publishedDate.getFullYear()}`;
                            const videoEmbed = new MessageEmbed()
                                .setTitle(`📺 - ${video.snippet.channelTitle} hat ein neues Video hochgeladen`)
                                .setURL(`https://www.youtube.com/watch?v=${video.id.videoId}`)
                                .setDescription(`Schaue gerne bei - **${video.snippet.title}** - rein.\n\n${video.snippet.description}`)
                                .setColor("#CF2626")
                                .setThumbnail(video.snippet.thumbnails.high.url)
                                .setImage(channelData.items[0].snippet.thumbnails.high.url)
                                .setFields(
                                    {
                                        name: "Veröffentlicht am:",
                                        value: `${publishedDateString}`,
                                        inline: true
                                    },
                                    {
                                        name: "-------------------------",
                                        value: "\u200b",
                                        inline: false
                                    },
                                    {
                                        name: "Subscriber:",
                                        value: `${channelData.items[0].statistics.subscriberCount}`,
                                        inline: true
                                    },
                                    {
                                        name: "Videos:",
                                        value: `${channelData.items[0].statistics.videoCount}`,
                                        inline: true

                                    }
                                )
                            }

                            const row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setURL(`https://www.youtube.com/watch?v=${video.id.videoId}`)
                                        .setLabel('Zum Video')
                                        .setStyle('LINK')
                                );
                            
                            const channel = await client.channels.fetch(data.helpers.videoNotification.notificationChannel);
                            channel.send({ content: `<@&${data.helpers.streamerNotification.notificationRole}>`, embeds: [videoEmbed], components: [row] });
                        }
                // } catch (error) {
                    // logger.error(error);
                // }
            }); 
        // } catch (error) {
            // logger.error(error);
        // }           
    }, data.helpers.videoNotification.intervalMinutes * 60 * 1000);
}

async function checkHasNewVideo(channel) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&maxResults=1&order=date&type=video&key=${process.env.YT_API_KEY}`);
    console.log(response.data);
    if (response.data.items.length === 0) {
        return false;
    } else if (response.data.items[0].id.videoId === channel.lastVideoId) {
        return false;
    }
    console.log("lol2");
    return true;
}

async function getNewVideos(channelId) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&key=${process.env.YT_API_KEY}`);
    let newVideos = [];
    for (item of response.data.items) {
        if (item.id.videoId === channel.lastVideoId) {
            break;
        }
        newVideos.push(item);
    }
    return newVideos;
}

async function getChannelData(channelId) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.YT_API_KEY}`);
    return response.data;
}

async function getOAuthToken() {

}