let u = require('../../utils')

const moment = require("moment");
require("moment-duration-format");

module.exports = {
	name: 'uptime',
    description: 'Displays the server uptime.',
    cooldown: 5,
	execute(message, args, client) {
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        message
            .reply(duration)
            .catch(e => {
                console.error(e)
                message.reply('Something went wrong while getting the uptime\nIf you think you have found a bug or glitch, please report it on the offical EVABot discord: https://discord.gg/MRaZTwJ')
            })
    }
};