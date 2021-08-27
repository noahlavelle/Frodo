"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const resetCommands_1 = require("./resetCommands");
const { token, clientID, guildID } = require('./config.json');
const rest = new rest_1.REST({ version: '9' })
    .setToken(token);
async function registerCommands(command) {
    try {
        const commandsList = [...resetCommands_1.commands, ...command];
        await rest.put(v9_1.Routes.applicationGuildCommands(clientID, guildID), { body: commandsList });
        // await rest.put(
        // 	Routes.applicationCommands(clientID),
        // 	{body: []},
        // );
        console.log('Registered Commands!');
    }
    catch (error) {
        console.error(error);
    }
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=refreshCommands.js.map