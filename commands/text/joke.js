const fetch = require('node-fetch');

module.exports = {
	name: 'joke',
    description: 'Gives you a random joke. Configurable filters are nsfw, religious, political, racist, sexist. They can be set using the command config jokeFilters <filter>,<filter> etc.',
	execute(message, args, client) {
        const filter = client.settings.get(message.guild.id, "jokeFilters")
        console.log(filter)
        fetch(`https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=${filter}`)
            .then(res => res.json())
            .then(json => {
                if (json.setup) message.channel.send(`${json.setup}\n${json.delivery}`); else if (json.joke) {
                    message.channel.send(`${json.joke}`);

                } else if (json.additionalInfo) {
                    message.channel.send(json.additionalInfo)
                }
            })
            .catch(err => {
                message.channel.send('We could not find a joke that matches your filters.\nIf you think you have found a bug or glitch, please report it on the offical EVABot discord: https://discord.gg/MRaZTwJ');
                return console.error(err);
            })
	},
};