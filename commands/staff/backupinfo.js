backup = require('discord-backup');
const { MessageEmbed } = require('discord.js')

module.exports = {
	name: 'backupinfo',
    description: 'Shows info about a backup.',
    cooldown: 3,
    userPermissions: ['ADMINISTRATOR'],
    guildOnly: true,
    args: true,
    usage: '<backupID>',
	execute(message, args, client) {
        let backupID = args[0];
        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:'0'+mm[0])}/${(dd[1]?dd:'0'+dd[0])}`;
            let embed = new MessageEmbed()
                .setAuthor('Backup Informations')
                .addFields(
                    { name:'Backup ID', value: backupInfos.id },
                    { name: 'Server ID', value: backupInfos.data.guildID},
                    { name: 'Size', value: `${backupInfos.size} mb`},
                    { name: 'Created at', value: formatedDate}
                )
                .setColor('#3498db');
            message.channel.send(embed);
        }).catch((err) => {
            return message.channel.send(':x: | No backup found for `'+backupID+'`!');
        });
	}
};