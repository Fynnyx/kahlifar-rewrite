const axios = require('axios');
const data = require(`${process.cwd()}/properties.json`)

exports.checkUsername = async (username) => {
    return axios(
        {
            method: "Get",
            url: "https://minecraft-user-data.p.rapidapi.com/",
            params: { name: username },
            headers: {
                'x-rapidapi-host': 'minecraft-user-data.p.rapidapi.com',
                'x-rapidapi-key': 'bfbd923ff9msha833ad9b3459459p11ea25jsndbbc5a541ba9'
            }
        }
    ).then(response => response.data)
        .catch(error => {
            if (error.response.status == 500) {
                return 500
            }
            return undefined;
        });
}