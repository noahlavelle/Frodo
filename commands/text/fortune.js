const fetch = require('node-fetch');

module.exports = {
	name: 'fortune',
    description: 'Gives you a fortune cookie message',
    aliases: ['fortunecookie'],
	execute(message, args, client) {
        fetch('http://yerkee.com/api/fortune')
            .then(res => res.json())
            .then(json => message.reply(json.fortune))
            .catch(err => {
                message.channel.send('We could not find you a fortune :confused:\nIf you think you have found a bug or glitch, please report it on the offical EVABot discord: https://discord.gg/MRaZTwJ');
                return console.error(err);
            })
	},
};