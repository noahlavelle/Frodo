const { generateEmbed, commandUsage } = require('../../utils');

module.exports = {
    name: 'help',
    description: 'List of all of my commands or info about a specific command',
    aliases: ['commands'],
    cooldown: 5,
    execute(message, args, client) {
        const data = [];
        const commands = client.commands;

        if (!args.length) {
            data.push(commands.map(command => command.name).join(', '));

            return message.author.send(generateEmbed('Frodo Help Menu', false, '#3498db', true, [{ name: 'Here\'s a list of all my commands:\n', value: data },
                { name: 'Command specific help:', value: 'You can send .help [command name] to get info on a specific command!' }, {name: 'Want to add me to your own server?', value:'https://discord.com/api/oauth2/authorize?client_id=734746193082581084&permissions=268691536&scope=bot'}]))
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!', '#00D166');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have DMs disabled?', '#EB403B');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        message.channel.send(generateEmbed(`Command: .${command.name}`, commandUsage(command), '#3498db', true, false));
    },
};
