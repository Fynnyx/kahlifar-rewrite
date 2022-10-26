const axios = require('axios');
const { writeFileSync } = require('fs');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const client = require('../index');
const data = require('../properties.json');
const videoChannels = require('../videoChannels.json');
const logger = require('../handlers/logger');

exports.startVideoNotifications = async () => {
    const videoNotificationInterval = setInterval(async () => {
        videoChannels.channels.forEach(async channel => {
            try {
                const channelItem = channel;
                const index = videoChannels.channels.indexOf(channelItem);
                if (await checkHasNewVideo(channelItem)) {
                    const newVideos = await getNewVideos(channelItem);
                    const channelData = await getChannelData(channelItem.id);
                    for (video of newVideos) {
                        const videoData = await getVideoData(video.id.videoId);
                        const publishedDate = new Date(videoData.snippet.publishedAt);
                        const publishedDateString = `${publishedDate.getHours()}:${publishedDate.getMinutes()}:${publishedDate.getSeconds()}\n${publishedDate.getDate()}.${publishedDate.getMonth() + 1}.${publishedDate.getFullYear()}`;
                        const videoEmbed = new MessageEmbed()
                            .setTitle(`📺 - ${videoData.snippet.channelTitle} hat ein neues Video hochgeladen`)
                            .setURL(`https://www.youtube.com/watch?v=${videoData.id.videoId}`)
                            .setDescription(`Schaue gerne bei - **${videoData.snippet.title}** - rein.\n\n${videoData.snippet.description}`)
                            .setColor("#CF2626")
                            .setThumbnail(channelData.snippet.thumbnails.high.url)
                            .setImage(videoData.snippet.thumbnails.high.url)
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
                                    value: `${channelData.statistics.subscriberCount}`,
                                    inline: true
                                },
                                {
                                    name: "Videos:",
                                    value: `${channelData.statistics.videoCount}`,
                                    inline: true

                                }
                            )
                            const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setURL(`https://www.youtube.com/watch?v=${videoData.id}`)
                                    .setLabel('Zum Video')
                                    .setStyle('LINK')
                            );
    
                        const channel = await client.channels.fetch(data.helpers.videoNotification.notificationChannel);
                        channel.send({ content: `<@&${data.helpers.streamerNotification.notificationRole}>`, embeds: [videoEmbed], components: [row] });
                        channelItem.lastVideoId = videoData.id;
                        videoChannels.channels[index] = channelItem;
                        writeFileSync('./videoChannels.json', JSON.stringify(videoChannels, null, 4));
                    }
                }
            } catch (error) {
                logger.error(error);
            }
        });
    }, data.helpers.videoNotification.intervalMinutes * 60 * 1000);
}

async function checkHasNewVideo(channel) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCNis5z5HX_cVCiqOLVsZRZw&maxResults=10&order=date&type=video&key=AIzaSyAAD_ZTm_0FREQ31zTr2rBPIUUDNlQYOZw`);
    if (response.data.items.length === 0) {
        return false;
    } else if (response.data.items[0].id.videoId === channel.lastVideoId) {
        return false;
    }
    return true;
}

async function getNewVideos(channel) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.id}&key=${process.env.YT_API_KEY}`);
    let newVideos = [];
    for (item of response.data.items) {
        if (item.id.videoId === channel.lastVideoId) {
            break;
        }
        const publishedAt = new Date(item.snippet.publishedAt);
        if (publishedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 7) {
            break;
        }
        newVideos.push(item);
    }
    return newVideos;
}

async function getVideoData(videoId) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=status,snippet,statistics,contentDetails,topicDetails&key=${process.env.YT_API_KEY}`);
    return response.data.items[0];
}

async function getChannelData(channelId) {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,contentDetails,id,snippet,statistics&id=${channelId}&key=${process.env.YT_API_KEY}`);
    return response.data.items[0];
}