const fetch = require('node-fetch');

module.exports = {
	name: 'fact',
    description: 'Gives you a fun, random fact.',
    aliases: ['funfact'],
	execute(message, args, client) {
        fetch('https://uselessfacts.jsph.pl/random.json?language=en')
            .then(res => res.json())
            .then(json => message.reply(json.text))
            .catch(err => {
                message.channel.send('We could not find you a fortune :confused:\nIf you think you have found a bug or glitch, please report it on the offical EVABot discord: https://discord.gg/MRaZTwJ');
                return console.error(err);
            })
	},
};