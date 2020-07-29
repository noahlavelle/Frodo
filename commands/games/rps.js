const { DMChannel } = require("discord.js");

const inGame = [];

module.exports = {
	name: 'rps',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user name>',
    guildOnly: true,
	execute(message, args, client) {
        const challanged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!challanged || challanged == message.member) return message.reply('Please enter a valid user');
        if (inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (inGame.includes(challanged.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        message
            .reply(`You have initiated an RPS game with ${args[0]}.`)
            .then(message.author.send(`You have challanged ${challanged.username} to an rps game. Type rock, paper, scissors or exit.`)).then(dmMessage => {
                dmMessage.channel.awaitMessages()
            })
            .then(challanged.send(`You have been challanged to an rps game by ${message.author.username}. Type rock, paper, scissors or exit.`))
        inGame.push(challanged.id, message.author.id);
	},
};