const utils = require('../../utils');

class Game { // Creating a game class so there is support for multiple games at once.
    constructor(message, challenged) { // Defining vars and running the game logic
        this.message = message;
        this.challenged = challenged;
        this.grid = new Array(6).fill();
        this.footer = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'];
        this.reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
    }

    async init() {
        for (let i in this.grid) { // Populate array
            this.grid[i] = new Array(7).fill(':white_large_square:');
        }
        this.gridMessage = `${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}`;
        this.msg = await this.message.channel.send(`This is a game of Connect4 between <@${this.message.author.id}> and <@${this.challenged.id}>\nCurrent Go: :blue_circle: <@${this.message.author.id}>.\n\n${this.gridMessage}`);
        for (let i in this.reactions) {
            this.msg.react(this.reactions[i]);
        }
        this.run();
    }

    async run() {
        await this.posCalcs(this.message.author.id, 'blue');
        await this.posCalcs(this.challenged.id, 'red');
        this.run();
    }

    async posCalcs(filterID, color) {
        const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reaction.emoji.name) && user.id === filterID;

        await this.msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first().emoji.name;
                for (let i in this.reactions) {
                    if (this.reactions[i] === reaction) {
                        this.position = parseInt(i);
                    }
                }

                for (let i = this.grid.length - 1; i >= 0; i--) {
                    if (this.grid[i][this.position] === ':white_large_square:') {
                        this.grid[i][this.position] = `:${color}_circle:`;
                        this.checkWin(color);
                        this.y = i;
                        this.gridMessage = `${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}`;
                        let user;
                        if (color === 'blue') {
                            user = `<@${this.challenged.id}>`;
                            color = 'red';
                        } else {
                            user = `<@${this.message.author.id}>`;
                            color = 'blue';
                        }
                        return this.msg.edit(`This is a game of Connect4 between <@${this.message.author.id}> and <@${this.challenged.id}>\nCurrent Go: :${color}_circle: ${user}.\n\n${this.gridMessage}`);
                    }
                }
            }).catch(() => {
                this.msg.edit('This game has timed out.');                
                utils.inGame = utils.inGame.filter(i => i !== this.message.author.id);
                utils.inGame = utils.inGame.filter(i => i !== this.challenged.id);
                this.msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            });

        const userReactions = this.msg.reactions.cache.filter(reaction => reaction.users.cache.has(filterID));
        for (const reaction of userReactions.values()) {
            await reaction.users.remove(filterID);
        }
    }

    async checkWin(color) {
        let streak = 0;
        for (let i in this.grid) {
            for (let j in this.grid) {
                if (this.grid[i][j].includes('_circle')) streak++;
                if (this.grid[i][j] === ':white_large_square:') streak = 0;
                if (streak === this.grid.length * 7) return this.win('draw');
            }
        }
        await this.checkColumnFull();
        await this.checkWinVer(color);
        this.checkWinDiag(color);
        this.checkWinDiagLeft(color);
        for (let i in this.grid) {
            streak = 0;
            for (let j in this.grid[i]) {
                if (this.grid[i][j] === `:${color}_circle:`) streak++; else streak = 0;
                if (streak === 4) {
                    return this.win(color);
                }
            }
        }
    }

    checkWinVer(color) {
        let streak = 0;
        let collumn = [];
        for (let i in this.grid) {
            collumn.push(this.grid[i][this.position]);
        }
        for (let i in collumn) {
            if (collumn[i] === `:${color}_circle:`) streak++; else streak = 0;
            if (streak === 4) {
                return this.win(color);
            }
        }
    }

    checkColumnFull() {
        let streak = 0;
        let collumn = [];
        for (let i in this.grid) {
            collumn.push(this.grid[i][this.position]);
        }
        for (let i in collumn) {
            if (collumn[i] !== ':white_large_square:') streak++; else streak = 0;
            if (streak === 6) {
                this.msg.reactions.cache.get(this.reactions[this.position]).remove();
            }
        }
    }

    checkWinDiag(color) {
        let streak = 0;
        let diagonal = [];
        let runningCheck = true;
        let runningPush = false;
        let i = this.y - 1;
        let j = this.position - 1;
        while (runningCheck) {
            i++;
            j++;
            if (i === this.grid.length || j === 7) {
                runningCheck = false;
                runningPush = true;
            }
        }
        while (runningPush) {
            i--;
            j--;
            diagonal.push(this.grid[i][j]);
            if (i === 0 || j === -1) {
                runningPush = false;
            }
        }

        for (i in diagonal) {
            if (diagonal[i] === `:${color}_circle:`) streak++; else streak = 0;
            if (streak === 4) {
                return this.win(color);
            }
        }
    }

    checkWinDiagLeft(color) {
        let streak = 0;
        let diagonal = [];
        let runningCheck = true;
        let runningPush = false;
        let i = this.y - 1;
        let j = this.position + 1;
        while (runningCheck) {
            i++;
            j--;
            if (i === this.grid.length || j === -1) {
                runningCheck = false;
                runningPush = true;
            }
        }
        while (runningPush) {
            i--;
            j++;
            diagonal.push(this.grid[i][j]);
            if (i === 0 || j === 6) {
                runningPush = false;
            }
        }

        for (i in diagonal) {
            if (diagonal[i] === `:${color}_circle:`) streak++; else streak = 0;
            if (streak === 4) {
                return this.win(color);
            }
        }
    }

    win(term) {
        let win;
        if (term === 'blue') {
            win = `<@${this.message.author.id}> won the game!`;
        } else if (term === 'red') {
            win = `<@${this.challenged.id}> won the game!`;
        } else {
            win = `It is a draw.`;
        }
        utils.inGame = utils.inGame.filter(i => i !== this.message.author.id);
        utils.inGame = utils.inGame.filter(i => i !== this.challenged.id);
        this.msg.edit(`${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}\n\n${win}`);
        this.msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    }
}

module.exports = {
    name: 'c4',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user>',
    execute(message, args) {
        const challenged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, ''));
        if (!challenged || challenged === message.member) return message.reply('Please enter a valid user');
        if (utils.inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.');
        if (utils.inGame.includes(challenged.id)) return message.reply('That user is allready in a game. Try again in a minute.');
        utils.inGame.push(challenged.id, message.author.id);

        const game = new Game(message, challenged);
        game.init();
    },
};
