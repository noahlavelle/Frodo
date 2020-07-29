var inGame = [];

module.exports = {
	name: 'rps',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user name>',
    guildOnly: true,
	execute(message, args, client) {
        const filter = (message => {
            return message.content == 'r' || message.content == 'p' || message.content == 's'
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
                const p2Message = await this.challanged.send('You have been challanged a game of rps. Please enter r, p, s')
                const p1Response = p1Message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).catch(() => {
                    message.author.send('Timeout');
                });
                const p2Response = p2Message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).catch(() => {
                    challanged.send('Timeout');
                });

                Promise.all([p1Response, p2Response]).then(values => {
                    const p1Choise = values[0].get((Array.from(values[0].keys())).toString()).content;
                    const p2Choise = values[1].get((Array.from(values[1].keys())).toString()).content;

                    if (p1Choise == 'r' && p2Choise == 's') return this.win('p1'); else if (p2Choise == 'r' && p1Choise == 's') return this.win('p2'); else if (p2Choise == 'r' && p1Choise == 'r') return this.win('draw')();
                    if (p1Choise == 'p' && p2Choise == 'r') return this.win('p1'); else if (p2Choise == 'p' && p1Choise == 'r') return this.win('p2'); else if (p2Choise == 'p' && p1Choise == 'p') return this.win('draw')();
                    if (p1Choise == 's' && p2Choise == 'p') return this.win('p1'); else if (p2Choise == 's' && p1Choise == 'p') return this.win('p2'); else if (p2Choise == 's' && p1Choise == 's') return this.win('draw')();
                });
            }

            win (type) {
                switch (type) {
                    case 'p1':
                        message.author.send('You Won!')
                        this.challanged.send('You lost :(')
                        game = null;
                        break;
                    case 'p2':
                        this.challanged.send('You Won!')
                        message.author.send('You lost :(')
                        game = null;
                        break;
                    case 'draw':
                        message.author.send('It was a draw.')
                        this.challanged.send('It was a draw.')
                        game = null;
                        break;
                }

                inGame = inGame.filter(i => i != message.author.id);
                inGame = inGame.filter(i => i != this.challanged.id);
                console.log(inGame)
            }
        }

        var game = new Game(message, challanged)
	},
};