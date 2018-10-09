import * as eris from "eris";
import * as fs from "fs";
import config from "./config.json";
import * as db from "./db";
import { Command, CommandModule, UserTimer } from "./types";

const bot = new eris.Client(config.botToken, { getAllUsers: true });
const moduleList: CommandModule[] = [];
// The string here is the userid of the user
const xpTimers: Map<string, UserTimer> = new Map<string, UserTimer>();

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
//                     Bot Events                         //
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
	if (await checkCommand(message, messageArgs, moduleList)){
		// This means a command was ran, so update database accordingly
		// There is no custom command system in place, but eventually adding that somehow is good
	}
	else{
		// Do other non-command stuff
		await handleExperience(message.author, message);
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
 * @param {Message} message An erisjs message object
 * @param {Array} args The message as an array of strings
 * @param {Array} modules An array of all the loaded commmand modules
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
	else{
		return false;
	}
}

/**
 * Handles adding experience for users
 *
 * @param {eris.User} user user that triggered event
 * @param {eris.Message} message message sent with the triggered event
 * @returns {void}
 */
async function handleExperience(user: eris.User, message: eris.Message){
	// This is a really dumb way of adding 15 to it so it ranges from 16-25 in xpGain
	const xpGain = (Math.floor(Math.random() * 10) + 1) + 15;

	// Gets timer to see if it exists
	const userTimer = xpTimers.get(user.id);
	if (userTimer){
		// This would mean a minute has passed
		if (Date.now() - userTimer.time < 60000){
			return;
		}
		else{
			// Because a minute has passed, you can add xp to the database
			const newTimer: UserTimer = { userid: user.id, time: Date.now() };
			xpTimers.set(user.id, newTimer);

			// Upserts userxp to the database. Upsert meaning insert or update depending on if it exists or not
			await db.UserLevels.upsert({
				currentxp: db.sequelize.literal(`currentxp + ${xpGain}`),
				userid: user.id,
				discriminator: user.discriminator,
				username: user.username,
				level: db.sequelize.literal("level"),
				totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
			}, {});

			// Check to see if message.member is undefined. This should only happen if the user isn't cached
			if (!message.member){
				return;
			}
			await db.GuildScores.upsert({
				userid: user.id,
				guildid: message.member.guild.id,
				score: db.sequelize.literal(`score + ${xpGain}`),
			});
		}
	}
	else {
		// Because the timer doesn't exist, add one to the list and then add xp
		const newTimer: UserTimer = { userid: user.id, time: Date.now() };
		xpTimers.set(user.id, newTimer);

		// Upserts userxp to the database. Upsert meaning insert or update depending on if it exists or not
		await db.UserLevels.upsert({
			currentxp: db.sequelize.literal(`currentxp + ${xpGain}`),
			userid: user.id,
			discriminator: user.discriminator,
			username: user.username,
			level: db.sequelize.literal("level"),
			totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
		}, {});

		// Check to see if message.member is undefined. This should only happen if the user isn't cached
		if (!message.member){
			return;
		}
		await db.GuildScores.upsert({
			userid: user.id,
			guildid: message.member.guild.id,
			score: db.sequelize.literal(`score + ${xpGain}`),
		});
	}
}

export {
	bot,
	moduleList,
};
