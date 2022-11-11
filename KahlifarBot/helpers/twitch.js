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