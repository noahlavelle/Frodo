const utils = require('../../utils');
const { color } = require('jimp');

module.exports = {
	name: 'werewolves',
    description: 'A game of Werewolves',
	execute(message, args, client) {
        class Game {
            constructor() {
                this.uniqueRoles = ['werewolf', 'seer'];
                this.players = [];
                this.checker = (arr, target) => target.every(v => arr.includes(v));
                this.init();
            }

            async init() {
                this.msg = await message.channel.send(`<@${message.author.id}> has started a game of **werewolves**! Press the blue join button to join the party. Once there are 7 players <@${message.author.id}> will have the option to start the game.`)
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
                const values = Array.from(this.reaction.users.cache.values());
                for (const value in values) {
                    if (!values[value].bot) {
                        this.players[value] = new Array(1).fill(values[value].id);
                    }
                }

                this.assiginedRoles = [];
                this.players[0] = new Array(1).fill(message.author.id);
                for (const player in this.players) {
                    await this.assignRole(player);
                }
                console.log(this.players)
            }

            assignRole(player) {
                const roleNumber = Math.round(Math.random() * (this.uniqueRoles.length - 1));
                if (this.checker(this.assiginedRoles, this.uniqueRoles)) return this.players[player].push('villager')
                if (this.assiginedRoles.includes(this.uniqueRoles[roleNumber])) return this.assignRole(player);
                this.players[player].push(this.uniqueRoles[roleNumber])
                return this.assiginedRoles.push(this.uniqueRoles[roleNumber]);
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

