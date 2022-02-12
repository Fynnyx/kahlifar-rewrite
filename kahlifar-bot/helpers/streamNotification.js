const axios = require('axios');
const client = require('../index');
const data = require('../properties.json');
const streamerData = require('./streamer.json');

exports.startNotifications = async () => {

    const notificationInterval = setInterval(async () => {
        streamerData.streamer.forEach(async streamer => {
            console.log(streamer.name)
            await getOAuthToken().then(async (token) => {
                console.log(token);
            })

            // axios.post(`https://api.twitch.tv/helix/streams?user_id=${streamer.name}?client_id=${process.env.CLIENTID}?client_secret=${process.env.CLIENTSECRET}`)
            //     .then(async (response) => {
            //         console.log(response.request.data);
            //     })
            //     .catch(async (error) => {
            //         console.error(error);
            //     });
        });
    }, data.helpers.streamerNotification.intervalMinutes * 60 * 1000);
}


getOAuthToken = async () => {
    await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&grant_type=client_credentials`)
        .then(async (response) => {
            console.log(response.data.access_token);
            console.log("Test");
            return response.data.access_token
        })
        .catch(async (error) => {
            console.log("Error");
            console.error(error);
        });
}