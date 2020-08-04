const { generateEmbed } = require('../../utils');

module.exports = {
    name: 'server',
    description: 'Displays info about the current server.',
    cooldown: 5,
    aliases: ['info'],
    guildOnly: true,
    execute(message) {
        message.reply(generateEmbed(`Server info for ${message.guild.name}:`, false, '#3498db', true,
            [{ name: `Total Members: ${message.guild.memberCount}`, value: `Total Online Members: ${message.guild.members.cache.filter(m => m.presence.status === 'online').size}` }], false, message.guild.iconURL()));
    },
};
