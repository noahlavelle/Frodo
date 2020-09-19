const backup = require('discord-backup');

module.exports = {
    name: 'addbackup',
    description: 'Creates a total backup of the server, including roles, settings, permissions, channels, catagories, images and webhooks.',
    cooldown: 15,
    aliases: ['newbackup', 'createbackup'],
    userPermissions: ['ADMINISTRATOR'],
    guildOnly: true,
    execute(message, args, client) {
	if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
		message.channel.send('I need `Administrator` to make a back-up')
		return
	}
        const prefix = client.settings.get(message.guild.id, 'prefix');
        backup.create(message.guild, {
            jsonBeautify: true,
        }).then(backupData => {
            message.author.send(`The backup has been created! To load it, type this command on the server of your choice: ${prefix}loadbackup ${backupData.id}`);
            message.channel.send(':white_check_mark: Backup successfully created. The backup ID was sent in dm!');
        });
    },
};
