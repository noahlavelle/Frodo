module.exports = {
	name: 'roll',
    description: 'Roles a die any size or flips a coin',
    usage: '<number of rolls> <die size>',
    aliases: ['die', 'dice', 'd'],
    guildOnly: false,
    args: true,
	execute(message,  args, client) {
        let finalMessage = 'You got '
        if (args.length == 1) args.push('6')
        if (parseInt(args[0]) > 100) return message.reply('Please choose a number less than 100')
        for (let i = 0; i < parseInt(args[0]); i++) {
            if (i == parseInt(args[0] - 1)) {
                finalMessage += `${Math.round(Math.random() * args[1] + 1)}`
                return message.reply(finalMessage)
            }
            finalMessage += `${Math.round(Math.random() * args[1] + 1)}, `
        }
	},
};