import Axios from "axios";
import * as eris from "eris";
import * as fs from "fs";
import pm2 from 'pm2';
import { generalConfig } from "./config/";
import { db, getBotSettings, initializeDb } from "./database/database";
import { CommandModule, UserTimer } from "./types";
import TriviaHandler from "./util/TriviaHandler";

////////////////////////////////////////////////////////////
//                                                        //
//              		Variables		                  //
//                                                        //
////////////////////////////////////////////////////////////

let botSettings: any;
const bot = new eris.Client("", { getAllUsers: true });

initializeDb().then(async () => {
	const config = await getBotSettings();
	console.log("Database initialized");
	bot.token = config.devtoken;
	/* bot.token = config.bottoken; */
	bot.connect();
	botSettings = config;
}).catch((err) => {
	console.error(err);
	pm2.restart("Kurisu", (error) => {
		if (error){
			return;
		}
	});
});

// Command list
const moduleList: CommandModule[] = [];

// The string here is the userid of the user
const msgTimer: Map<string, UserTimer> = new Map<string, UserTimer>();
const minDeltaTime = 30000;

let triviaGames: TriviaHandler[] = [];
let loadedFiles = 0;

////////////////////////////////////////////////////////////
//                                                        //
//              Load all command modules                  //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * This block of code loads all the command modules within the command/ dir
 */
fs.readdir("./commands/", (folderErr, folders) => {
	folders.forEach((folderName) => {
		try{
			const props = require(`./commands/${folderName}`);
			if (props){
				moduleList.push(props.default);
			}
			return;
		}
		catch (ex){
			console.log(ex);
			return;
		}

	});
});

////////////////////////////////////////////////////////////
//                                                        //
//                     Bot Events                         //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * Prepare the bot to be turned on.
 */
bot.on("ready", async () => {
	for (const commandModule of moduleList){
		loadedFiles += commandModule.commands.length;
	}
	console.log(`Loaded ${loadedFiles} commands`);
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	await bot.editStatus("online", {name: `${botSettings.defaultprefix}help to get command list`});
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
	if (await checkCommand(message, messageArgs, moduleList)){
		// This means a command was ran, so update database accordingly
		// There is no custom command system in place, but eventually adding that somehow is good
	}
	else if (generalConfig.xpMoneyEnabled === true){
		// Do other non-command stuff
		await updateExperience(message.author, message);
	}
});

////////////////////////////////////////////////////////////
//                                                        //
//                   Helper Functions                     //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * Returns true or false depending on whether a command was ran
 * @param {Message} message An erisjs message object
 * @param {Array} args The message as an array of strings
 * @param {Array} modules An array of all the loaded commmand modules
 */
async function checkCommand(message: eris.Message, args: string[], modules: CommandModule[]){
	if (message.content.startsWith(botSettings.defaultprefix)){
		// Starting at 1 index so that it takes away the prefix
		// This makes it easier to later allow custom prefixes for servers, and just check for those too in the if case above
		args[0] = args[0].substring(1);
		modules.forEach(async (module) => {
			if (!message.member){
				return;
			}
			if (!module.checkPermissions(message.member.permission)){
				message.channel.createMessage("You don't have permission to use this command");
				return;
			}
			if (module.name.toLowerCase() === "owner"){
				const devs: any = generalConfig.developerIds;
				if (!devs.includes(message.author.id)){
					return;
				}
			}

			const command = module.findCommand(args[0]);

			if (command){
				if (!command.checkPermissions(message.member.permission)){
					message.channel.createMessage("You don't have permission to use this command");
					return;
				}

				if (command.deleteCommand === true){
					await message.delete();
				}

				args.shift();
				await command.commandFunc(message, args);

				return true;
			}
			else{
				return false;
			}
		});
	}
	else{
		return false;
	}
}

/**
 * Event handler that runs everytime that a message is created
 */
bot.on("messageCreate", async (message) => {
	if (message.author.bot) {
		return;
	}
	await updateExperience(message.author, message);
});

bot.connect();

/**
 * Handles adding experience for users
 *
 * @param {eris.User} user user that triggered event
 * @param {eris.Message} message message sent with the triggered event
 * @returns {void}
 */
async function updateExperience(user: eris.User, message: eris.Message){
	Axios.post(`${generalConfig.apiEndpoint}api/user/expupdate`, {
		apiKey: botSettings.apikey,
		userId: message.author.id,
		guild: message.member ? message.member.guild : undefined,
		username: message.author.username,
		discriminator: message.author.discriminator,
	}).then((result) => {
		if (result.data.leveledUp){
			console.log(result.data);
			// message.channel.createMessage("Leveled UP!"); // test message
			return;
		}
	});
}

////////////////////////////////////////////////////////////
//                                                        //
//                   Trivia Functions                     //
//                                                        //
////////////////////////////////////////////////////////////

/**
 * Adds a TriviaHandler to array. Returns false if channel id already exists
 * @param {Array} handler TriviaHandler to add to array
 */
function addTrivia(handler: TriviaHandler){
	const found = triviaGames.find((x) => x.token === handler.token);
	// Means there already is an ongoing game in the channel
	if (found){
		return false;
	}
	else{
		triviaGames.push(handler);
		return true;
	}
}

/**
 * Removes a TriviaHandler from array
 * @param {Array} handler TriviaHandler to remove from array
 */
function removeTrivia(handler: TriviaHandler){
	let index = 0;
	for (const triv of triviaGames){
		if (triv.token === handler.token){
			break;
		}
		else{
			index++;
		}
	}
	triviaGames = triviaGames.splice(index, 1);
}

export {
	bot,
	getBotSettings,
	moduleList,
	addTrivia,
	removeTrivia,
};
