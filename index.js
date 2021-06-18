"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.EmbedColor = void 0;
const Discord = require("discord.js");
const discord_js_1 = require("discord.js");
const commandData_1 = require("./commandData");
// @ts-ignore
const client = new Discord.Client({ intents: [discord_js_1.Intents.ALL] });
exports.client = client;
exports.EmbedColor = '#3498db';
client.once('ready', async () => {
    client.user.setActivity('/akinator | https://frodo.fun', { type: 'PLAYING' });
    for (const key of Object.keys(commandData_1.CommandData)) { // @ts-ignore
        await client.guilds.cache.get('839919274395303946')?.commands.create(commandData_1.CommandData[key]);
        await client.guilds.cache.get('853033979803729920')?.commands.create(commandData_1.CommandData[key]);
    }
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