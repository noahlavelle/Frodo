"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.FrodoClient = void 0;
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var FrodoClient = /** @class */ (function (_super) {
    __extends(FrodoClient, _super);
    function FrodoClient(args) {
        var _this = _super.call(this, args) || this;
        _this.commands = new discord_js_1.Collection();
        _this.loadCommands();
        return _this;
    }
    FrodoClient.prototype.loadCommands = function () {
        var _this = this;
        var commandFiles = (0, fs_1.readdirSync)('./commands');
        commandFiles.forEach(function (dir) {
            console.info("Loading command from file ".concat(dir));
            var commands = (0, fs_1.readdirSync)("./commands/".concat(dir));
            commands.forEach(function (file) {
                var commandPackage = require("./commands/".concat(dir, "/").concat(file, "/package.json"));
                var commandFile = require("./commands/".concat(dir, "/").concat(file, "/").concat(commandPackage.main || 'index.js'));
                var command = {
                    data: commandPackage,
                    run: commandFile
                };
                _this.commands.set(commandPackage.name, command);
            });
        });
    };
    return FrodoClient;
}(discord_js_1.Client));
exports.FrodoClient = FrodoClient;
var client = new FrodoClient();
console.log(client);
