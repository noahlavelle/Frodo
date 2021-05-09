"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Discord = require("discord.js");
const discord_js_1 = require("discord.js");
const commandData_1 = require("./commandData");
const client = new Discord.Client({ intents: [discord_js_1.Intents.ALL] });
exports.client = client;
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    yield ((_a = client.guilds.cache.get('839919274395303946')) === null || _a === void 0 ? void 0 : _a.commands.create(commandData_1.CommandData.connectFourCommandData));
    yield ((_b = client.guilds.cache.get('839919274395303946')) === null || _b === void 0 ? void 0 : _b.commands.create(commandData_1.CommandData.rpsCommandData));
    yield ((_c = client.guilds.cache.get('839919274395303946')) === null || _c === void 0 ? void 0 : _c.commands.create(commandData_1.CommandData.akinatorCommandData));
    yield ((_d = client.guilds.cache.get('839919274395303946')) === null || _d === void 0 ? void 0 : _d.commands.create(commandData_1.CommandData.countdownCommandData));
    console.log('Ready');
}));
client.on('interaction', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    commandData_1.CommandHandlers[interaction.commandName](interaction);
}));
// login to Discord with your app's token
client.login(process.env.TOKEN).then(() => console.log('Logging in'));
//# sourceMappingURL=index.js.map