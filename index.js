"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.EmbedColor = void 0;
const Discord = require("discord.js");
const discord_js_1 = require("discord.js");
const commandData_1 = require("./commandData");
const client = new Discord.Client({ intents: [discord_js_1.Intents.ALL] });
exports.client = client;
exports.EmbedColor = '#3498db';
client.once('ready', async () => {
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.connectFourCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.rpsCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.akinatorCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.anagramsCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.tttCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.hangmanCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.werewolfCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.factCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.fortuneCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.jokeCommandData);
    // await client.guilds.cache.get('839919274395303946')?.commands.create(CommandData.insultCommandData);
    console.log('Ready');
});
client.on('interaction', async (interaction) => {
    if (!interaction.isCommand())
        return;
    commandData_1.CommandHandlers[interaction.commandName](interaction);
});
// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logged in'));
//# sourceMappingURL=index.js.map