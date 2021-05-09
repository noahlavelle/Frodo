"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Discord = require("discord.js");
const discord_js_1 = require("discord.js");
const commandData_1 = require("./commandData");
const client = new Discord.Client({ intents: [discord_js_1.Intents.ALL] });
exports.client = client;
client.once('ready', async () => {
    await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData.connectFourCommandData);
    await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData.rpsCommandData);
    await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData.akinatorCommandData);
    await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData.anagramsCommandData);
    await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData.oxoCommandData);
    console.log('Ready');
});
client.on('interaction', async (interaction) => {
    if (!interaction.isCommand())
        return;
    commandData_1.CommandHandlers[interaction.commandName](interaction);
});
// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logging in'));
//# sourceMappingURL=index.js.map