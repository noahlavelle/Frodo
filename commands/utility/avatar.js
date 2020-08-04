const { generateEmbed } = require('../../utils');

module.exports = {
    name: 'avatar',
    description: 'Get the avatar URL of the tagged user(s), or your own avatar.',
    aliases: ['icon', 'pfp'],
    guildOnly: true,
    execute(message, args) {
        if (!args.length) sendAvatar('Your Avatar', message.author);
        // eslint-disable-next-line array-callback-return
        message.mentions.users.map(user => {
            sendAvatar(`${user.username}'s Avatar`, user);
        });

        function sendAvatar(title, target) {
            message.channel.send(generateEmbed(title, false, '#3498db', true, false, target.displayAvatarURL({ dynamic: true })));
        }
    },
};
