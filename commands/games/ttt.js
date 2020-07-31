const { DMChannel, Collection } = require("discord.js");
var inGame = []

module.exports = {
	name: 'ttt',
    description: 'Challange a player to Tic Tac Toe',
    args: true,
    usage: '<user name>',
    guildOnly: true,
	execute(message, args, client) {
        const player_two = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!player_two || player_two == message.member) return message.reply('Please enter a valid user');
        if (inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (inGame.includes(player_two.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        inGame.push(player_two.id, message.author.id);

        class Game {
            constructor(message, player_two) {
                this.player_two = player_two
                this.message = message;
                this.grid = ['', '', '', '', '', '', '', '', '']
                this.get_image();
                this.players_go = 0
                this.send_message = true
                this.playing_game = true
                this.run();
            }

            async run() {
                await this.eval_win()
                if (this.playing_game == true) {
                await this.get_image()
                    if (this.players_go % 2  == 0) {
                        if (this.send_message == true) {
                            this.message.channel.send('<@' + this.message.author.id + '> it is your turn',{
                                files: [
                                    './output.png'
                                ]
                            })
                        }
                        this.message.channel.awaitMessages(m => m.author.id == this.message.author.id,
                            {max: 1, time: 1000000}).then(collected => {
                                const p1Response = collected.first().content
                                if (Number.isInteger(p1Response)) {{this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}}
                                if (p1Response <= 0 || p1Response >= 10) {this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}
                                if (this.grid[p1Response - 1] == 'X' || this.grid[p1Response - 1] == 'O') {this.message.channel.send("Please enter a number that hasn't been taken yet."); this.send_message = false; this.run(); return;}
                                this.grid[p1Response - 1] = 'X'
                                this.send_message = true
                                this.players_go++
                                this.run()
                            })
                    }
                    if (this.players_go % 2  == 1) {
                        if (this.send_message == true) {
                            this.message.channel.send('<@' + this.player_two.id + '> it is your turn',{
                                files: [
                                    './output.png'
                                ]
                            })
                        }
                        this.message.channel.awaitMessages(m => m.author.id == this.player_two.id,
                            {max: 1, time: 1000000}).then(collected => {
                                const p2Response = collected.first().content
                                if (Number.isInteger(p2Response)) {{this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}}
                                if (p2Response <= 0 || p2Response >= 10) {this.message.channel.send('Please enter a number between 1 and 9.'); this.send_message = false; this.run(); return;}
                                if (!this.grid[p2Response - 1] == '') {this.message.channel.send("Please enter a number that hasn't been taken yet."); this.send_message = false; this.run(); return;}
                                this.grid[p2Response - 1] = 'O'
                                this.send_message = true
                                this.players_go++
                                this.run()
                            })}
                }
            }
            async get_image() {
                    let img = []
                    let step = -1
                    const Jimp = require('jimp')
                    while (step < 8) {
                        step++
                        if (this.grid[step] == 'X') {img[step] = await Jimp.read('./pictures/X/' + parseInt(step + 1) + '.png')}
                        if (this.grid[step] == 'O') {img[step] = await Jimp.read('./pictures/O/' + parseInt(step + 1) + '.png')}
                        if (this.grid[step] == '') {img[step] = await Jimp.read('./pictures/null.png')}
                    }
                    try {
                        const background = await Jimp.read('pictures/background.png')
                        for (let i in img) {
                            await background.composite(img[i], 0, 0)
                        }
                        await background.write('./output.png')
                    }
                    catch(err){
                        console.log(err)
                    }
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
                await this.get_image()
                while (step_one < 7) {
                    step_one++
                    if (this.grid[win_combinations[step_one][0]] == 'X' && this.grid[win_combinations[step_one][1]] == 'X' && this.grid[win_combinations[step_one][2]] == 'X') {
                        this.message.channel.send('<@' + this.message.author.id + '> Won!',{
                            files: [
                                './output.png'
                            ]
                        })
                        this.end_game(this.player_two, this.message)
                    }
                    if (this.grid[win_combinations[step_one][0]] == 'O' && this.grid[win_combinations[step_one][1]] == 'O' && this.grid[win_combinations[step_one][2]] == 'O') {
                        this.message.channel.send('<@' + this.player_two.id + '> Won!',{
                            files: [
                                './output.png'
                            ]
                        })
                        this.end_game(this.player_two, this.message)
                    }
                    if (this.players_go == 9 && step_one == 7) {
                        this.message.channel.send('You drew!',{
                            files: [
                                './output.png'
                            ]
                        })
                        this.end_game(this.player_two, this.message)
                    }
                }
            }
            end_game(player_two, message) {
                inGame = inGame.filter(i => i != message.author.id);
                inGame = inGame.filter(i => i != player_two.id);
                game = null
                this.playing_game = false
                return;
            }
        }
            
        var game = new Game(message, player_two)

	},
};