const inGame = [];

module.exports = {
	name: 'rps',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user name>',
    guildOnly: true,
	execute(message, args, client) {
        const filter = (message => {
            return message.content == 'r' || message.content == 'p' ||message.content == 's'
        });

        const challanged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!challanged || challanged == message.member) return message.reply('Please enter a valid user');
        if (inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (inGame.includes(challanged.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        inGame.push(challanged.id, message.author.id);
        class Game {
            constructor(message, challanged) {
                this.message = message;
                this.challanged = challanged;
                this.run();
            }

            async run() {
                const p1Message = await message.author.send('You have created a game of rps. Please enter r, p, s')
                const p2Message = await this.challanged.send('You have been challanged a game of rps. Please enter r, p, s or exit')
                const p1Response = p1Message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                }).catch(() => {
                    message.author.send('Timeout');
                });
                const p2Response = p2Message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                }).catch(() => {
                    message.author.send('Timeout');
                });

                Promise.all([p1Response, p2Response]).then(values => console.log(values))
            }
        }

        const game = new Game(message, challanged)
	},
};