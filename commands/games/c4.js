var inGame = [];

module.exports = {
	name: 'c4',
    description: 'Challange a player to Rock Paper Scissors',
    args: true,
    usage: '<user>',
	execute(message, args, client) {
        const filter = (message => {
            return message.content == 'r' || message.content == 'p' || message.content == 's'; // The filter for await messages. It only allows the responses r, p or s
        });

        const challenged = message.guild.members.cache.get(args[0].replace(/[^0-9]/g, '')); // Getting the user who was mentioned
        if (!challenged || challenged == message.member) return message.reply('Please enter a valid user'); // If none is mentioned or you mentioned yourself return
        if (inGame.includes(message.author.id)) return message.reply('You are allready in a game. Please finish that first.'); // Checking if you are allready in a game
        if (inGame.includes(challenged.id)) return message.reply('That user is allready in a game. Try again in a minute.'); // Checking if the person you challenged is in a game and if so return
        inGame.push(challenged.id, message.author.id); // Push both ids to the inGame array so they are registered as in a game
        class Game { // Creating a game class so there is support for multiple games at once.
            constructor(message, challenged) { // Defining vars and running the game logic
                this.message = message;
                this.challenged = challenged;
                this.grid = new Array(6).fill();
                this.footer = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'];
                this.reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']
                this.init();
            }

        async init() {
            for (let i in this.grid) { // Populate array
                this.grid[i] = new Array(7).fill(':white_large_square:')
            }
            this.gridMessage = `${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}`;
            this.msg = await message.channel.send(this.gridMessage)
            for (let i in this.reactions) {
                this.msg.react(this.reactions[i])
            }
            this.run();

        }

        async run() {
            await this.posCalcs(message.author.id, 'blue');
            await this.posCalcs(challenged.id, 'red');
            this.run();

        }

        async posCalcs(filterID, color) {
            const filter = (reaction, user) => {
                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reaction.emoji.name) && user.id === filterID;
            };

            await this.msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first().emoji.name;
                    for (let i in this.reactions) {
                        if (this.reactions[i] == reaction) {
                            this.position = parseInt(i)
                        }
                    }

                    for (let i = this.grid.length - 1; i >= 0; i--) {
                        if (this.grid[i][this.position] == ':white_large_square:') {
                            this.grid[i][this.position] = `:${color}_circle:`;
                            this.checkWin(color);
                            this.y = i
                            return this.msg.edit(`${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}`);
                        }
                    }

                }).catch(() => {
                    this.msg.edit('This game has timed out.');
                    game = null;
                    this.msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                })

                const userReactions = this.msg.reactions.cache.filter(reaction => reaction.users.cache.has(filterID));
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(filterID);
                }
    }

    async checkWin(color) {
        await this.checkWinVer(color)
        await this.checkWinDiag(color);
        for (let i in this.grid) {
            let streak = 0;
            for (let j in this.grid[i]) {
                if (this.grid[i][j] == `:${color}_circle:`) streak++;
                if (this.grid[i][j] == ':white_large_square:') streak = 0;
                if (streak == 4) {
                    return console.log('Win')
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
            if (collumn[i] == `:${color}_circle:`) streak++;
            if (collumn[i] == ':white_large_square:') streak = 0;
            if (streak == 4) {
                return console.log('Win')
            }
        }
    }

    checkWinDiag(color) {
        let streak = 0;
        let diagonal = [];
        let runningCheck = true
        let runningPush = false
        let i = this.y - 1;
        let j = this.position + 1;
        while (runningCheck) {
            i++;
            j--;
            if (i == this.grid.length || j == -1 ) {
                runningCheck = false;
                runningPush = true
            }
        }
        while (runningPush) {
            i--;
            j++;
            diagonal.push(this.grid[i][j]);
            if (i == 0 || j == 6) {
                runningPush = false; 
            }
        }

        for (let i in diagonal) {
            if (diagonal[i] == `:${color}_circle:`) streak++;
            if (diagonal[i] == ':white_large_square:') streak = 0;
            if (streak == 4) {
                return console.log('Win')
            }
        }
    }
}

    var game = new Game

	},
};