class Game {
    constructor(message, client) {
        this.client = client;
        this.message = message;
        this.uniqueRoles = ['werewolf', 'werewolf2', 'seer'];
        this.players = [];
        this.werewolves = [];
        this.villagers = [];
        this.checker = (arr, target) => target.every(v => arr.includes(v));
    }

    async init() {
        this.msg = await this.message.channel.send(`<@${this.message.author.id}> has started a game of **werewolves**! Press the blue join button to join the party. Once there are 7 players <@${this.message.author.id}> will have the option to start the game.`);
        this.msg.react('🔵');
        this.reactionCount = 0;
        this.party();
    }
    async party() {
        const filter = (reaction, user) => reaction.emoji.name === '🔵' && !user.bot && user.id !== this.message.author.id;
        await this.msg.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] }).then(collected => {
            this.reaction = collected.first();
        });

        this.reactionCount++;
        if (this.reactionCount === 1) {
            await this.msg.react('🟢');
            return this.startGame();
        }
        this.party();
    }

    async startGame() {
        const filter = (reaction, user) => reaction.emoji.name === '🟢' && user.id === this.message.author.id;
        await this.getReaction(filter, 600000, this.msg);
        const values = Array.from(this.reaction.users.cache.values());
        for (const value in values) {
            if (!values[value].bot) {
                this.players[value] = new Array(1).fill(values[value].id);
            }
        }

        this.assiginedRoles = [];
        this.players[0] = new Array(1).fill(this.message.author.id);
        for (const player in this.players) {
            await this.assignRole(player);
        }

        const roleVillagers = await this.message.guild.roles.create({
            data: {
                name: 'Werewolves Game',
            } });
        const roleWerewolves = await this.message.guild.roles.create({
            data: {
                name: 'Werewolves Game',
            } });
        this.message.guild.channels.create('Werewolves party - Werewolves', 'text')
            .then(async channel => {
                this.werewolvesChannel = channel;
                const everyone = this.message.guild.roles.everyone.id;
                await channel.overwritePermissions([
                    {
                        id: everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: roleWerewolves.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                    },
                ]);
                for (const player in this.werewolves) {
                    this.message.guild.members.cache.get(this.werewolves[player]).roles.add(roleWerewolves);
                }
                channel.send('This is the channel where you, the werewolves, will decide who to kill Don\'t worry, this channel is private so you won\'t get any villagers snooping around.');
            });
        await this.message.guild.channels.create('Werewolves party - Villagers', 'text')
            .then(async channel => {
                this.globalChannel = channel;
                const everyone = this.message.guild.roles.everyone.id;
                await channel.overwritePermissions([
                    {
                        id: everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: roleVillagers.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                    },
                    {
                        id: roleWerewolves.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                    },
                ]);
                for (const player in this.villagers) {
                    this.message.guild.members.cache.get(this.villagers[player]).roles.add(roleVillagers);
                }
                channel.send('This is the channel where you will all discus who to kill each round. But beware, the **werewolves** are also somewhere in this room!');
            });

        this.night();
    }

    assignRole(player) {
        const roleNumber = Math.round(Math.random() * (this.uniqueRoles.length - 1));
        if (this.checker(this.assiginedRoles, this.uniqueRoles)) return this.players[player].push('villager');
        if (this.assiginedRoles.includes(this.uniqueRoles[roleNumber])) return this.assignRole(player);
        if (this.uniqueRoles[roleNumber] === 'werewolf' || this.uniqueRoles[roleNumber] === 'werewolf2') { this.werewolves.push(this.players[player][0]); } else {
            this.villagers.push(this.players[player][0]);
        }
        this.players[player].push(this.uniqueRoles[roleNumber]);
        return this.assiginedRoles.push(this.uniqueRoles[roleNumber]);
    }

    async getReaction(filter, time, message) {
        await message.awaitReactions(filter, { max: 1, time: time, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                return reaction;
            });
    }

    night() {
        this.globalChannel.send('It is night time and you all fall to sleep. There are werewolves snooping around the village choosing one person to eat tonight');
        this.voteKill(this.werewolvesChannel, 'You must discuss and agree on a villager to kill. Once you have decided type ``-kill username``');
    }

    async voteKill(channel, message) {
        console.log('hi');
        this.voteCount = 0;
        channel.send(message);
        let response = await channel.awaitMessages(m => m.content === '-kill ZigDevZat', {
            max: 1,
        });

        response = response.get(Array.from(response.keys()).toString()).content;

        response = response.slice(6);

        let user = this.client.users.cache.find(u => u.username === response);
        let msg = await this.werewolvesChannel.send(`Vote to kill ${user.username}. All players must agree.`);
        await msg.react('👍');
        await msg.react('👎');
        for (const i in this.werewolves) {
            const filter = reaction => ['👍', '👎'].includes(reaction.emoji.name);
            let reaction = await this.getReaction(filter, {
                max: 1,
            });
            if (reaction.emoji.name === '👎' && !reaction.bot) {
                message.edit('Someone dissagreed.');
                this.voteKill(channel, message);
            } else if (i === this.werewolves.length - 1) {
                channel.send(`Vote over, killing ${user.username}`);
            }
        }
    }

    async getResponse(channel, filter) {
        let response = await channel.awaitMessages(filter, {
            max: 1,
        });

        response = response.get(Array.from(response.keys()).toString()).content;

        return response;
    }
}

module.exports = {
    name: 'werewolves',
    description: 'A game of Werewolves',
    execute(message, args, client) {
        const game = new Game(message, client);
        game.init();
    },
};
