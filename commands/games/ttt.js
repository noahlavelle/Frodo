const { DMChannel, Collection } = require("discord.js");
const utils = require('../../utils');

module.exports = {
	name: 'ttt',
    description: 'Challange a player to Tic Tac Toe',
    args: true,
    usage: '<user name>',
    guildOnly: true,
	execute(message, args, client) {
        const player_two = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!player_two || player_two == message.member) return message.reply('Please enter a valid user');
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (utils.inGame.includes(player_two.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        utils.inGame.push(player_two.id, message.author.id);

        class Game {
            constructor(message, player_two) {
                this.player_two = player_two
                this.message = message;
                this.grid = [':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:', ':white_large_square:']
                this.ttt_grid()
                this.players_go = 0
                this.send_message = true
                this.playing_game = true
                this.ttt_message = false
                this.run();
            }

            async run() {
                await this.eval_win()
                if (this.playing_game == true) {
                    if (this.players_go % 2  == 0) {
                        if (this.send_message == true) {
                            let grid = await this.ttt_grid()
                            if (this.players_go == 0) {
                                this.ttt_message =  await this.message.channel.send('<@' + this.message.author.id + '> it is your turn\n' + grid)
                            }
                            else {
                                this.ttt_message.edit('<@' + this.message.author.id + '> it is your turn\n' + grid)
                            }
                        }
                        this.message.channel.awaitMessages(m => m.author.id == this.message.author.id,
                            {max: 1, time: 1000000}).then(collected => {
                                const p1Response = collected.first().content
                                if (Number.isInteger(p1Response)) {{this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}}
                                if (p1Response <= 0 || p1Response >= 10) {this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}
                                if (this.grid[p1Response - 1] == ':negative_squared_cross_mark:' || this.grid[p1Response - 1] == ':regional_indicator_o:') {this.message.channel.send("Please enter a number that hasn't been taken yet."); this.send_message = false; this.run(); return;}
                                this.grid[p1Response - 1] = ':negative_squared_cross_mark:'
                                this.send_message = true
                                this.players_go++
                                this.run()
                            })
                    }
                    if (this.players_go % 2  == 1) {
                        if (this.send_message == true) {
                            let grid = await this.ttt_grid()
                            this.ttt_message.edit('<@' + this.player_two.id + '> it is your turn\n' + grid)
                        }
                        this.message.channel.awaitMessages(m => m.author.id == this.player_two.id,
                            {max: 1, time: 1000000}).then(collected => {
                                const p2Response = collected.first().content
                                if (Number.isInteger(p2Response)) {{this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}}
                                if (p2Response <= 0 || p2Response >= 10) {this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}
                                if (!this.grid[p2Response - 1] == ':negative_squared_cross_mark:' || this.grid[p2Response - 1] == ':regional_indicator_o:') {this.message.channel.send("Please enter a number that hasn't been taken yet."); this.send_message = false; this.run(); return;}
                                this.grid[p2Response - 1] = ':regional_indicator_o:'
                                this.send_message = true
                                this.players_go++
                                this.run()
                            })}
                }
            }
            async ttt_grid() {
                    return `${this.grid[0]}${this.grid[1]}${this.grid[2]}\n${this.grid[3]}${this.grid[4]}${this.grid[5]}\n${this.grid[6]}${this.grid[7]}${this.grid[8]}`
            }
            async eval_win() {
                const win_combinations = [
                    [0, 1, 2],
                    [3, 4, 5], 
                    [6, 7, 8], 
                    [0, 3, 6], 
                    [1, 4, 7], 
                    [2, 5, 8], 
                    [0, 4, 8], 
                    [2, 4, 6] 
                ]
                let step_one = -1
                while (step_one < 7) {
                    step_one++
                    if (this.grid[win_combinations[step_one][0]] == ':negative_squared_cross_mark:' && this.grid[win_combinations[step_one][1]] == ':negative_squared_cross_mark:' && this.grid[win_combinations[step_one][2]] == ':negative_squared_cross_mark:') {
                        let grid = await this.ttt_grid()
                        this.ttt_message.edit('<@' + this.message.author.id + '> Won!\n' + grid)
                        this.end_game(this.player_two, this.message)
                    }
                    if (this.grid[win_combinations[step_one][0]] == ':regional_indicator_o:' && this.grid[win_combinations[step_one][1]] == ':regional_indicator_o:' && this.grid[win_combinations[step_one][2]] == ':regional_indicator_o:') {
                        let grid = await this.ttt_grid()
                        this.ttt_message.edit('<@' + this.player_two.id + '> Won!\n' + grid)
                        this.end_game(this.player_two, this.message)
                    }
                    if (this.players_go == 9 && step_one == 7) {
                        let grid = await this.ttt_grid()
                        this.ttt_message.edit('You drew!\n' + grid)
                        this.end_game(this.player_two, this.message)
                    }
                }
            }
            end_game(player_two, message) {
                utils.inGame = utils.inGame.filter(i => i != message.author.id);
                utils.inGame = utils.inGame.filter(i => i != player_two.id);
                game = null
                this.playing_game = false
                return;
            }
        }
            
        var game = new Game(message, player_two)

	},
};