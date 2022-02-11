const client = require('../index');
const data = require('../properties.json');
const streamerData = require('./streamer.json');

exports.startNotifications = async () => {

    const notificationInterval = setInterval(async () => {

    }, data.streamerNotification.intervalMinutes * 60 * 1000);
}