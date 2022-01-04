import {Client, Collection} from 'discord.js';
import {readdirSync} from 'fs';

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
    		console.info(`Loading commands from file ${dir}`);
    		const commands = readdirSync(`./commands/${dir}`);
    		commands.forEach((file) => {
    			console.info(`	-Loading command ${file}`);
                import {command} from `./commands/${dir}/${file}/command`;
                import {run} from `./commands/${dir}/${file}/${commandPackage.main || 'index.js'}`;
                const command = {
                    data: command,
                    run,
                };
                this.commands.set(command.name, command);
    		});
    	});
    }
}

const client = new FrodoClient();
console.log(client);
