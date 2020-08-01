const Enmap = require('enmap');

module.exports = {
	name: 'config',
    description: 'Customises the bot to suit the server better',
    args: true,
    usage: '<what-is-changed> <value>',
    subcommands: `custom prefix <value> - Changes prefix\n custom staffroles <role, role, role etc.> - Sets roles that cannot be set by bots without user having admin\n custom default-role <role> - Changes the role given to new users`,
    userPermissions: ['ADMINISTRATOR'],
    aliases: ['settings'],
    guildOnly: true,
	execute(message, args, client) {
        const [prop, ...value] = args;
        if(!client.settings.has(message.guild.id, prop)) {
            return message.reply("This key is not in the configuration.");
          }

        client.settings.set(message.guild.id, value.join(" "), prop);
        message.channel.send(`Guild configuration item ${prop} has been changed to:\n\`${value.join(" ")}\``)
	},
};