var inGame = [];

module.exports = {
	name: 'c4',
    description: 'Challange a player to Rock Paper Scissors',
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
            this.blank = `${this.grid[0].join('')}\n${this.grid[1].join('')}\n${this.grid[2].join('')}\n${this.grid[3].join('')}\n${this.grid[4].join('')}\n${this.grid[5].join('')}\n${this.footer.join('')}`;
            this.msg = await message.channel.send(this.blank)
            for (let i in this.reactions) {
                this.msg.react(this.reactions[i])
            }
            this.run();
        }

        async run() {
            const userReactions = this.msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id, challenged.id));
            for (const reaction of userReactions.values()) {
                reaction.users.remove(message.author.id);
                reaction.users.remove(challenged.id);
            }
            await this.p1Calcs();
            

        }

        async p1Calcs() {
            const filter = (reaction, user) => reaction.emoji.name === ':one:'
            this.msg.awaitReactions(filter, { max: 1})
            .then(collected => {
                console.log(collected);
            }).catch(console.error);

        }
    }

    var game = new Game

	},
};