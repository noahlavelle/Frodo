import {MessageHandler} from './utils/ErrorHandling/CommandHandler.js';
import {Client, Collection, CommandInteraction, CommandInteractionOptionResolver} from 'discord.js';
import {readdirSync} from 'fs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {commandToJson} from './utils/CommandToJson.js';

export {MessageHandler as Message, CommandInteractionOptionResolver as Options, CommandInteraction as Interaction};

export class FrodoClient extends Client {
	commands: Collection<string, any>;
	startTime: number;

	constructor(args?) {
		super(args);
		this.commands = new Collection();
		this.startTime = Date.now();
		this.loadCommands();
	}

	private async loadCommands() {
		const commandFiles = readdirSync('./src/commands');
		let commands;
		let command;
		let run;
		let commandData;
		for (const dir of commandFiles) {
			this.debugLog(`Loading commands from file ${dir}`);
			commands = readdirSync(`./src/commands/${dir}`);
			for (const file of commands) {
				command = (await import(`./commands/${dir}/${file}/command.js`)).command;
				run = (await import(`./commands/${dir}/${file}/${command.main || 'index.js'}`)).default;
				this.debugLog(` -> Loading command ${file}`);
				commandData = {
					data: command,
					run: run.bind(this),
				};
				this.commands.set(command.name, commandData);
			}
		}

		this.registerCommands();
		this.connectToDiscord();
	}

	private async registerCommands() {
		const rest = new REST({version: '9'})
			.setToken(process.env.TOKEN);

		const commandList = [];

		for (const command of this.commands.values()) {
			commandList.push(commandToJson(command.data));
		};

		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, '839919274395303946'),
			{body: commandList},
		);

		await rest.put(
			Routes.applicationCommands(process.env.CLIENTID || '734746193082581084'),
			{body: []},
		);

		this.debugLog('All commands registered');
	}

	private async connectToDiscord() {
		this.debugLog('Attempting to login...');
		await this.login(process.env.TOKEN);
		this.debugLog('Logged into Discord');
		this.registerEvents();
	}

	private async registerEvents() {
		this.debugLog('Registering events');
		const eventFolders = readdirSync('./src/events');
		let event;
		for (const eventName of eventFolders) {
			const eventFiles = readdirSync(`./src/events/${eventName}`);
			for (const eventFile of eventFiles) {
				if (!eventFile.endsWith('.js')) continue;
				event = (await import(`./events/${eventName}/${eventFile}`)).default;
				this.debugLog(` -> Registering event ${eventName} (${eventFile})`);
				this.on(eventName, event.bind(this));
			}
		}

		this.debugLog('Events registered');
		this.finishDiscordLogin();
	}

	private finishDiscordLogin() {
		this.debugLog('Finished logging into Discord');
		this.debugLog(`Started in ${this.timeSinceStart} seconds`);
	}

	get timeSinceStart() {
		return (Date.now() - this.startTime)/1000;
	}

	debugLog(message) {
		console.log(`[DEBUG][${this.timeSinceStart}] ${message}`);
	}
}
