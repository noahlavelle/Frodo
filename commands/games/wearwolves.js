const utils = require('../../utils');
const { color } = require('jimp');

module.exports = {
	name: 'wearwolves',
    description: 'A game of wearwolves',
	execute(message, args, client) {
        const uniqueRoles = ['wearwolf', 'seer', 'doctor', 'witch', 'drunk', 'alpha'];
        class Game {
            constructor() {
                this.uniqueRoles = ['wearwolf', 'seer', 'doctor', 'witch', 'drunk', 'alpha'];
                this.players = [];
                this.init();
            }

            async init() {
                this.players.push(message.author.id)
                this.msg = await message.channel.send(`<@${message.author.id}> has started a game of **wearwolves**! Press the blue join button to join the party. Once there are 7 players <@${message.author.id}> will have the option to start the game.`)
                this.msg.react('🔵');
                this.reactionCount = 0;
                this.party();
            }
            async party() {
                const filter = (reaction, user) => {
                    return reaction.emoji.name == '🔵' && !user.bot && user.id != message.author.id;
                }
                await this.msg.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] }).then(collected => {
                    this.reaction = collected.first();
                })
                
                this.reactionCount++;
                if (this.reactionCount == 1) {
                    await this.msg.react('🟢');
                    return this.startGame();
                }
                this.party();
            }

            async startGame() {
                const filter = (reaction, user) => {
                    return reaction.emoji.name == '🟢' && user.id == message.author.id;
                }
                await this.getReaction(filter, 600000)
                const keys = await this.reaction.users.cache.keys();
                for (let i in keys) {
                    console.log('hi')
                    console.log(i, this.reaction.users.cache[keys[i]])
                    if (!this.reaction.users.cache[keys[i]].bot) {
                        console.log(this.reaction.users.cache[keys[i]].id)
                        this.players.push(this.reaction.users.cache[keys[i]].id);
                    }
                }

                
            }

            async getReaction(filter, time) {
                await this.msg.awaitReactions(filter, { max: 1, time: time, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    return reaction;

                });
            }
        }
        var game = new Game
    }
}

