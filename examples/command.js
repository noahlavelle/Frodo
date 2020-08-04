// eslint-disable-next-line no-unused-vars
const { generateEmbed } = require('../../utils'); // Require everything needed from other files.

module.exports = {
    // Command name - accessed with command.name **NECESSARY**
    name: 'announce',
    // Command description - accesed with command.description - Can be left out
    description: 'Announces to a channel.',
    // Command aliases. Stored in an array and can be as long as necessary.
    // Accessed with command.aliases - Can be left out
    aliases: ['say', 'send'],
    // If it can only be run in a server.
    // True for server only and false will allow it to be used in dms. Accessed with command.guildOnly - Can be left out
    guildOnly: true,
    // Whether the command accepts arguments or not. - Can be left out
    args: true,
    // Shows the necessary arguments for the command - Can be left out
    usage: '<message> <channel>',
    // Shows any subcommands like everyone and here for mentions - Can be left out
    subcommands: 'announce everyone, announce here',
    // Shows full examples for the command, useful for complicated ones - Can be left out
    examples: '.announce everyone Hello #general',
    // Permissions needed for the user to run the command.
    // Here is a list of all of them:
    // https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags - Can be left out
    userPermissions: ['MANAGE_MESSAGES', 'MANAGE_ROLES'],
    // eslint-disable-next-line no-unused-vars
    execute(message, args, client) {
        // Execute function contains all code for the command.
        // The parameters are passed through when the command is run in index.js.
        // Message is an object used to represent the data of a message.
        // Args is an array with all words after the initial command.
        // Client is the client.
        message.channel.send(
            `Hello, this is an announcement. your full message was ${message.content} and your first argument was ${args[0]}`,
        );
    },
};
