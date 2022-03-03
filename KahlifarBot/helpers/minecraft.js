const axios = require('axios');

exports.checkUsername = async (username) => {
    return axios(
        {
            method: "Get",
            url: `https://api.ashcon.app/mojang/v2/user/${username}`,
        }
    ).then(response => {
        return response.data
    }).catch(error => {
        if (error.response.status == 500) {
            return 500
        }
        return undefined;
    });
}