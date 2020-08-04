module.exports = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['latency', 'ms'],
    cooldown: 5,
    execute(message) {
        message.channel.send('Pong!').then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`Pong! \`\`${ping}ms\`\``);
        });
    },
};
