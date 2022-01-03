import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

export class FrodoClient extends Client {
    commands: Collection<string, any>;

    constructor(args?) {
        super(args);
        this.commands = new Collection();
        this.loadCommands();
    }

    loadCommands() {
        const commandFiles = readdirSync('./commands');
        commandFiles.forEach((dir) => {
            console.info(`Loading command from file ${dir}`);
            const commands = readdirSync(`./commands/${dir}`);
            commands.forEach((file) => {
                const commandPackage = require(`./commands/${dir}/${file}/package.json`);
                const commandFile = require(`./commands/${dir}/${file}/${commandPackage.main || 'index.js'}`);
                const command = {
                    data: commandPackage,
                    run: commandFile
                };
                this.commands.set(commandPackage.name, command);
            });
        });
    }
}

const client = new FrodoClient();
console.log(client);
