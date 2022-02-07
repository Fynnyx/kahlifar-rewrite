const axios = require('axios');
const data = require(`${process.cwd()}/properties.json`)

// exports.checkUsername = async (username) => {
//     var options = {
//         method: 'GET',
//         url: 'https://minecraft-user-data.p.rapidapi.com/',
//         params: { name: username },
//         headers: {
//             'x-rapidapi-host': 'minecraft-user-data.p.rapidapi.com',
//             'x-rapidapi-key': 'bfbd923ff9msha833ad9b3459459p11ea25jsndbbc5a541ba9'
//         }
//     };
//     axios.request(options).then(function (response) {
//         let data = response.data
//         // console.log(data);
//         return data;
//     }).catch(function (error) {        
//         return undefined;
//     });
// }7

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
            return undefined;
        });
}