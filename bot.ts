import * as eris from "eris";
import * as fs from "fs";
import config from "./config.json";
import { Command, CommandModule } from "./types";

const bot = new eris.Client(config.botToken, { getAllUsers: true });
const moduleList: CommandModule[] = [];

// This reads all the commands from the /commands/ folder and adds them to the bot
fs.readdir("./commands/", (folderErr, folders) => {
	let loadedFiles = 0;
	folders.forEach((folderName) => {
		fs.readdir(`./commands/${folderName}`, (fileErr, files) => {
			const commands: Command[] = [];
			const commandModule = {
				commands,
				name: folderName,
			};
			let index = 0;
			files.forEach((file) => {

				const commandName = file.split(".")[0];
				const props = require(`./commands/${folderName}/${file}`);
				loadedFiles++;
				commandModule.commands.push(
					{
						aliases: props.aliases,
						description: props.description,
						function: props.function,
						name: commandName,
						usage: config.commandPrefix + props.usage,
					});
				if (index + 1 === files.length) {
					moduleList.push(commandModule);
					return;
				}
				else{
					index++;
				}
			});
			console.log(`Loaded ${loadedFiles} commands in module ${folderName}`);

			moduleList.sort((a: CommandModule, b: CommandModule) => {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});
		});
	});
});

bot.on("ready", async () => {
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	let statusMessage: string;
	statusMessage = `${config.commandPrefix}help to get command list`;

	await bot.editStatus("online", {name: statusMessage});
});

bot.on("messageCreate", async (message) => {
	if (message.author.bot){
		return;
	}
	const messageArgs = message.content.split(" ");
	// Check if there are any commands that match this message
	moduleList.forEach((module) => {
		for (const command of module.commands){
			if (command.name === messageArgs[0]){
				console.log(command);
				// command.function does not exist too late to bugfix
				command.function(message, messageArgs);
				return;
			}
		}
		return;
	});
});

bot.connect();

export {
	bot,
};