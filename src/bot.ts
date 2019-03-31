import eris from "eris";
import config from "./config";
import CommandHandler from "./handlers/CommandHandler";
import DatabaseHandler from "./handlers/DatabaseHandler";

const bot = new eris.Client(config.bot.botToken, {
	getAllUsers: true,
	defaultImageFormat: "png",
	defaultImageSize: 1024,
	disableEveryone: true,
	autoreconnect: true,
});

const commands = new CommandHandler(bot);
commands.loadCommands();
commands.hookEvent();

const db = new DatabaseHandler();
db.init();

bot.on("ready", async () => {
	console.log(`Loaded commands`);
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	await bot.editStatus("online", {name: `${config.bot.defaultPrefix}help to get command list`});
});

bot.connect();

export {
	bot,
	commands,
};