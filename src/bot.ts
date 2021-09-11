/**
 * Bot.ts - Main bot entrypoint
 */
import eris, { Client } from "eris";
import config from "./config";
import { CommandHandler, DatabaseHandler, ExperienceHandler, GuildEventHandler } from "./handlers";

export class Bot {
	cnf: typeof config;
	client: Client;

	// Handlers
	db: DatabaseHandler;
	commands: CommandHandler;
	exp: ExperienceHandler;
	guildEvent: GuildEventHandler;

	constructor(e_cnf: typeof config, production: boolean) {
		this.cnf = e_cnf;

		this.client = new eris.Client(production ? this.cnf.bot.botToken : this.cnf.bot.devToken, {
			defaultImageFormat: "png",
			defaultImageSize: 1024,
			allowedMentions: {
				everyone: false,
				roles: false,
				users: false,
			},
			getAllUsers: true,
			intents: [
				"guildBans",
				"guildMembers",
				"guildMessageReactions",
				"guildMessages",
				"guilds",
			],
			autoreconnect: true,
		});

		this.client.once("ready", async () => {
			console.info("Successfully connected as: " + this.client.user.username + "#" + this.client.user.discriminator);
			this.client.editStatus("online", {name: `${this.cnf.bot.defaultPrefix}help to get command list`, type: 0});
		});

		this.client.on("error", (err: Error) => {
			// I got real fucking sick of network errors
// 			if (this.cnf.bot.developerIds.length > 0) {
// 				const firstDev = this.cnf.bot.developerIds[0];
// 				this.client.getDMChannel(firstDev).then((channel) => {
// 					channel.createMessage(`**Unhandled Error**
// 	Name: ${err.name}
// 	Message: ${err.message}
// 	Stack: ${err.stack}
// `);

// // 				});
			// }
		});

		this.connect();
	}

	public async connect(){
		this.db = new DatabaseHandler();
		try{
			// Connect to database
			await this.db.init();
			console.info("Database connection successful");
		}
		catch (e) {
			console.error(e);
			throw new Error("Database connection failed");
		}

		this.exp = new ExperienceHandler();
		this.commands = new CommandHandler();
		this.guildEvent = new GuildEventHandler();

		this.exp.initialize(this);
		this.commands.initialize(this);
		this.guildEvent.initialize(this);

		console.info("Commands loaded successfully");
		this.commands.loadCommands();

		console.info("Registering events");
		this.commands.hookEvent();
		this.guildEvent.hookEvent();
		this.exp.hookEvent();

		this.client.connect();
	}
}
export const bot = new Bot(config, true);
