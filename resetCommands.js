"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandData = exports.commands = void 0;
const commandData_1 = require("./commandData");
Object.defineProperty(exports, "CommandData", { enumerable: true, get: function () { return commandData_1.CommandData; } });
const commands = [];
exports.commands = commands;
Object.keys(commandData_1.CommandData).forEach((command) => {
    if (command === 'triviaCommandData')
        return;
    commands.push(commandData_1.CommandData[command].data.toJSON());
});
//# sourceMappingURL=resetCommands.js.map