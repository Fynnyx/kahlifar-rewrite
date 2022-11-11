const axios = require('axios')
const logger = require('../handlers/logger')

exports.getOAuthToken = async () => {
    // async function getOAuthToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.CLIENTID,
            client_secret: process.env.CLIENTSECRET,
            grant_type: 'client_credentials'
        })
        return response.data.access_token
    } catch (e) {
        logger.error("Error in getOAuthToken\n" + e)
    }
}

exports.checkIsLive = async (streamerName) => {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, {
            headers: {
                'Authorization': `Bearer ${await this.getOAuthToken()}`,
                'Client-Id': process.env.CLIENTID
            }
        })
        if (response.data.data.length > 0) {
            return true
        } else {
            return false
        }
    } catch (e) {
        logger.error("Error in checkIsLive\n" + e)
    }
}

exports.getStreamData = async (streamerName) => {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, {
            headers: {
                'Authorization': `Bearer ${await this.getOAuthToken()}`,
                'Client-Id': process.env.CLIENTID
            }
        })
        return response.data.data[0]
    } catch (e) {
        logger.error("Error in getStreamData\n" + e)
    }
}