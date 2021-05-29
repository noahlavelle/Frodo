"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Werewolf = void 0;
const discord_js_1 = require("discord.js");
const partyLobby_1 = require("../../partyLobby");
const index_1 = require("../../index");
var Roles;
(function (Roles) {
    Roles[Roles["Seer"] = 0] = "Seer";
    Roles[Roles["Doctor"] = 1] = "Doctor";
    Roles[Roles["Werewolf"] = 2] = "Werewolf";
    Roles[Roles["Villager"] = 3] = "Villager";
})(Roles || (Roles = {}));
const wait = require('util').promisify(setTimeout);
const roleStack = [Roles.Werewolf, Roles.Werewolf];
class Werewolf extends partyLobby_1.PartyLobby {
    constructor(interaction) {
        super(interaction, 'Werewolf', '**Werewolf** is a classic social deduction party game. ' +
            'Press the blue button to join and the red button to leave. The minimum number of players are 2', 2);
        this.gameRunning = true;
        this.interaction = interaction;
        this.playerRoles = [];
        this.werewolves = [];
    }
    async gameStarted(players) {
        super.gameStarted(players);
        this.players = players;
        for (const role of roleStack) {
            const randomIndex = Math.floor(Math.random() * players.length);
            this.playerRoles.push([this.players[randomIndex], role]);
            if (role == Roles.Werewolf)
                this.werewolves.push(this.players[randomIndex]);
            this.players.splice(randomIndex, 1);
        }
        for (const user of this.players) {
            this.playerRoles.push([user, Roles.Villager]);
        }
        this.players = players;
        await this.createChannels();
        while (this.gameRunning) {
            await this.sendNightMessages();
            const werewolvesFilter = (msg) => {
                return msg.content.split(' ').length == 1 && msg.mentions.users.size == 1 && !this.werewolves.includes(msg.mentions.users.first());
            };
            const generalFilter = (msg) => {
                return msg.content.split(' ').length == 1 && msg.mentions.users.size == 1;
            };
            try {
                await this.werewolvesChannel.awaitMessages(werewolvesFilter, { max: 1 }).then(async (collected) => {
                    if (collected.first() != null) {
                        await this.killPlayer(collected.first().mentions.users.first());
                        await this.generalChannel.send('', new discord_js_1.MessageEmbed()
                            .setTitle('Day Time:')
                            .setDescription(`It is now day. The person who has been killed is ${collected.first().mentions.users.first()}. You now need to choose who to kill. Once you decided just mention them in an empty message.`)
                            .setColor(index_1.EmbedColor));
                        let targetChosen = false;
                        while (!targetChosen) {
                            await this.generalChannel.awaitMessages(generalFilter, { max: 1 }).then(async (collected) => {
                                const message = await this.generalChannel.send('', new discord_js_1.MessageEmbed()
                                    .setTitle('Voting:')
                                    .setDescription(`${collected.first().mentions.users.first()} has been chosen. After 15 seconds has passed the votes will be collected and they will be killed if there is a majority`)
                                    .setColor(index_1.EmbedColor));
                                await message.react(Object.keys(this.buttonReactions)[0]);
                                await message.react(Object.keys(this.buttonReactions)[1]);
                                await wait(5000);
                                const voteCount = message.reactions.cache.filter((reaction) => reaction.emoji.name == Object.keys(this.buttonReactions)[0]).first().count;
                                const skipCount = message.reactions.cache.filter((reaction) => reaction.emoji.name == Object.keys(this.buttonReactions)[1]).first().count;
                                if (voteCount > skipCount) {
                                    targetChosen = true;
                                    await this.generalChannel.send('', new discord_js_1.MessageEmbed()
                                        .setTitle('Voting:')
                                        .setDescription(`${collected.first().mentions.users.first()} has been killed`)
                                        .setColor(index_1.EmbedColor));
                                    await this.killPlayer(collected.first().mentions.users.first());
                                }
                                else {
                                    await this.generalChannel.send('', new discord_js_1.MessageEmbed()
                                        .setTitle('Voting:')
                                        .setDescription(`The vote has failed. To try again just mention someone in a blank message`)
                                        .setColor(index_1.EmbedColor));
                                }
                            });
                        }
                    }
                });
            }
            catch { }
        }
    }
    async checkWin() {
        let werewolfCount = 0;
        let villagerCount = 0;
        for (const playerRole of this.playerRoles) {
            if (playerRole[1] == Roles.Werewolf) {
                werewolfCount++;
            }
            else {
                villagerCount++;
            }
        }
        if (werewolfCount >= villagerCount) {
            await this.werewolvesChannel.delete('Game ended');
            await this.generalChannel.delete('Game ended');
            await this.message.channel.send('The game of werewolf has finished. The winners are the werewolves!');
            this.gameRunning = false;
        }
        else if (werewolfCount == 0) {
            await this.werewolvesChannel.delete('Game ended');
            await this.generalChannel.delete('Game ended');
            await this.message.channel.send('The game of werewolf has finished. The winners are the villagers!');
            this.gameRunning = false;
        }
    }
    async killPlayer(player) {
        await this.generalChannel.updateOverwrite(player.id, { SEND_MESSAGES: false });
        await this.werewolvesChannel.updateOverwrite(player.id, { SEND_MESSAGES: false });
        this.players.splice(this.players.indexOf(player));
        await this.checkWin();
    }
    async sendNightMessages() {
        await this.generalChannel.send('', new discord_js_1.MessageEmbed()
            .setTitle('Night Time:')
            .setDescription('The werewolves will now decide who to kill. If you have a special role you will be DMd when you need to make a choice')
            .setColor(index_1.EmbedColor));
        await this.werewolvesChannel.send('', new discord_js_1.MessageEmbed()
            .setTitle('Night Time:')
            .setDescription('You need to choose who to kill. When you have chosen who to kill just mention them in an empty message')
            .setColor(index_1.EmbedColor));
    }
    async createChannels() {
        const werewolvesPermissionOverride = [];
        const generalPermissionsOverride = [];
        werewolvesPermissionOverride.push({
            id: this.interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        });
        generalPermissionsOverride.push({
            id: this.interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        });
        for (const playerRole of this.playerRoles) {
            if (playerRole[1] == Roles.Werewolf) {
                werewolvesPermissionOverride.push({
                    id: playerRole[0].id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                });
            }
            generalPermissionsOverride.push({
                id: playerRole[0].id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
            });
        }
        this.generalChannel = await this.interaction.guild.channels.create('Werewolf - General', {
            type: 'text',
            permissionOverwrites: generalPermissionsOverride,
        });
        this.werewolvesChannel = await this.interaction.guild.channels.create('Werewolf - Werewolves', {
            type: 'text',
            permissionOverwrites: werewolvesPermissionOverride,
        });
        await this.generalChannel.send('', new discord_js_1.MessageEmbed()
            .setTitle('Werewolf')
            .setDescription('Welcome to Werewolf. This is the channel for everyone, so keep your role here secret. If you have a special role like seer or doctor you will be ' +
            'DMd. Werewolves have a private channel that villagers cannot see.')
            .setColor(index_1.EmbedColor));
        await this.werewolvesChannel.send('', new discord_js_1.MessageEmbed()
            .setTitle('Werewolf')
            .setDescription('Welcome to werewolf. You are all werewolves and your goal is to kill all the villagers')
            .setColor(index_1.EmbedColor));
    }
}
exports.Werewolf = Werewolf;
//# sourceMappingURL=werewolf.js.map