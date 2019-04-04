/**
 * Bot.ts - Main bot entrypoint
 */
import eris from "eris";
import config from "./config";
import { CommandHandler, DatabaseHandler } from "./handlers";

/* Initialize main modules */
// Discord api connecton
const bot = new eris.Client(config.bot.botToken, {
	getAllUsers: true,
	defaultImageFormat: "png",
	defaultImageSize: 1024,
	disableEveryone: true,
	autoreconnect: true,
});

// Handlers
const commands = new CommandHandler(bot);
const db = new DatabaseHandler();

/* Initialize main modules */
// Load commands
commands.loadCommands();
commands.hookEvent();
console.log("Commands loaded successfully");

// Connect to database
db.init().then(() => {
	console.log("Database connection successfull");
});

/* Run the bot */
bot.on("ready", async () => {
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	await bot.editStatus("online", {name: `${config.bot.defaultPrefix}help to get command list`});
});

bot.connect();

export {
	bot,
	commands,
};
