import * as eris from "eris";
import * as fs from "fs";
import config from "./config.json";
import { Command, CommandModule } from "./types";

const bot = new eris.Client(config.botToken, { getAllUsers: true });
const moduleList: CommandModule[] = [];

////////////////////////////////////////////////////////////
//                                                        //
//              Load all command modules                  //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * This block of code loads all the command modules within the command/ dir
 */
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
						fullDescription: props.fullDescription,
						function: props.commandFunc,
						name: commandName,
						usage: config.commandPrefix + props.usage,
						requirements: props.requirements,
						deleteCommand: props.deleteCommand,
					});
				console.log(props);
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

////////////////////////////////////////////////////////////
//                                                        //
//                     Prepare Bot                        //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * Prepare the bot to be turned on.
 */
bot.on("ready", async () => {
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	let statusMessage: string;
	statusMessage = `${config.commandPrefix}help to get command list`;

	await bot.editStatus("online", {name: statusMessage});
});

/**
 * Event handler that runs everytime that a message is created
 */
bot.on("messageCreate", async (message) => {
	if (message.author.bot){
		return;
	}
	const messageArgs = message.content.split(" ");
	// Check if there are any commands that match this message
	if (checkCommand(message, messageArgs, moduleList)){
		// This means a command was ran, so update database accordingly
		// There is no custom command system in place, but eventually adding that somehow is good
	}
	else{
		// Do other non-command stuff
	}
});

bot.connect();

////////////////////////////////////////////////////////////
//                                                        //
//                   Other Functions                      //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * Returns true or false depending on whether a command was ran
 * @param {Message} message - An erisjs message object
 * @param {Array} args - The message as an array of strings
 * @param {Array} modules - An array of all the loaded commmand modules
 */
async function checkCommand(message: eris.Message, args: string[], modules: CommandModule[]){
	if (message.content.startsWith(config.commandPrefix)){
		// Starting at 1 index so that it takes away the prefix
		// This makes it easier to later allow custom prefixes for servers, and just check for those too in the if case above
		args[0] = args[0].substring(1);
		modules.forEach(async (module) => {
			for (const command of module.commands){
				if (command.name === args[0]){
					await command.function(message, args);
					return true;
				}
			}
			return false;
		});
	}
}

export {
	bot,
	moduleList,
};
