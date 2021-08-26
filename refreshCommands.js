"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const commandData_1 = require("./commandData");
const commands = [];
for (const command of Object.keys(commandData_1.CommandData)) {
    commands.push(commandData_1.CommandData[command].data.toJSON());
}
;
const rest = new rest_1.REST({ version: '9' })
    .setToken(process.env.TOKEN);
(async () => {
    try {
        await rest.put(v9_1.Routes.applicationGuildCommands('737286732512493580', '839919274395303946'), { body: [] });
        await rest.put(v9_1.Routes.applicationGuildCommands('737286732512493580', '839919274395303946'), { body: commands });
        await rest.put(v9_1.Routes.applicationCommands('737286732512493580'), { body: [] });
        console.log('Registered Commands!');
    }
    catch (error) {
        console.error(error);
    }
})();
//# sourceMappingURL=refreshCommands.js.map