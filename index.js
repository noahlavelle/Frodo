"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.timestamp = exports.EmbedColor = void 0;
const Discord = require("discord.js");
const discord_js_1 = require("discord.js");
const resetCommands_1 = require("./resetCommands");
// @ts-ignore
const client = new Discord.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS] });
exports.client = client;
exports.EmbedColor = '#3498db';
exports.timestamp = Date.now();
function statusRotation(statuses, speed) {
    let current = 0;
    setInterval(() => {
        const activity = statuses[current];
        if (typeof (activity[0]) === 'function')
            activity[0] = activity[0]();
        client.user.setActivity(activity[0], { type: activity[1] || 'PLAYING' });
        current++;
        current %= statuses.length;
    }, speed);
}
;
client.once('ready', async () => {
    statusRotation([
        ['Frodo V2 is here!'],
        ['Type @Frodo'],
        ['.help'],
        [() => `${client.guilds.cache.size} servers!`, 'WATCHING'],
    ], 10000);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    if (Object.keys(resetCommands_1.CommandData).includes(`${interaction.commandName}CommandData`)) {
        resetCommands_1.CommandData[`${interaction.commandName}CommandData`].execute(interaction);
    }
});
const helpEmbed = (auth) => {
    return new discord_js_1.MessageEmbed()
        .setColor(exports.EmbedColor)
        .setTitle('Frodo V2 is here!')
        .setDescription('Frodo has updated! We now use slash commands, all commands have been revamped and many bugs have been fixed and we have two new commands, werewolf and othello! But there\'s one step you need to take to use the new version.')
        .addField('New Permissions:', `In order to use slash commands, you need to give Frodo new permissions. Someone from this server with the \`Manage Server\` permission can authorise it at https://slash.frodo.fun\nThis server currently has slash commands ${auth ? '`Enabled`' : '`Disabled`'} for Frodo.`)
        .addField('How to use new commands:', 'Once Frodo has been given the new permissions, type `/` to view its commands!')
        .addField('Not Working?', 'Let us know at our [feedback page](https://frodo.fun/feedback) and we will be in contact to fix your issue!');
};
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('.') || message.content.includes(client.user.id)) {
        let auth = true;
        try {
            // await message.guild.commands.fetchPermissions();
        }
        catch (err) {
            auth = false;
        }
        ;
        if (message.content.includes(`<@!${client.user.id}>`) || (message.content.startsWith('.') && !auth)) {
            await message.reply({ embeds: [helpEmbed(auth)] });
        }
        ;
    }
    ;
});
// login to Discord with your app's token
client.login(require('./config.json').token).then(() => console.log('Logged in'));
//# sourceMappingURL=index.js.map