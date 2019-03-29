import eris from "eris";
import config from "./config";
import { registerCommands } from "./handlers/CommandHandler";

const bot = new eris.Client(config.bot.botToken, {
	getAllUsers: true,
	defaultImageFormat: "png",
	defaultImageSize: 1024,
	disableEveryone: true,
	autoreconnect: true,
});
const loadedFiles = registerCommands(bot);

bot.on("ready", async () => {
	console.log(`Loaded ${loadedFiles} commands`);
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	await bot.editStatus("online", {name: `${config.bot.defaultPrefix}help to get command list`});
});

bot.connect();

export {
	bot,
};