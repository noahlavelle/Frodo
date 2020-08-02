let tag;

const fetch = require('node-fetch');

module.exports = {
	name: 'insult',
    description: 'Gives an evil insult or insults someone',
    usage: '<@user>',
    aliases: ['burn', 'roast'],
	execute(message, args, client) {
        if (args[0] && args[0].includes('@')) {
            tag = args[0]
        } else {
            tag = ''
        }
        fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
            .then(res => res.json())
            .then(json => message.channel.send(`${tag} :fire: ${json.insult}`))
            .catch(err => {
                message.channel.send('We could not find you an evil insult :confused:\nIf you think you have found a bug or glitch, please report it on the offical EVABot discord: https://discord.gg/MRaZTwJ');
                return console.error(err);
            })
	},
};