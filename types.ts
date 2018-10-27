import eris from "eris";
import fs from "fs";
import path from "path";

/**
 * Interface for a command object
 *
 * @interface Command
 * @prop {string} name The name of the command
 * @prop {string} description A short description of the command
 * @prop {string} fullDescription A more in depth description of the command
 * @prop {string} Basic usage instructions for the command
 * @prop {string[]} aliases Other names for the command
 * @prop {object} List of requirements needed for the command
 * @prop {boolean} Flag used to determine wether to delete the uder message
 */
interface Command {
	commandName: string;
	description: string;
	fullDescription: string;
	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<{}>}
	 */
	commandFunc: (message: eris.Message, args: string[]) => Promise<{}>;
	usage: string;
	aliases: string[];
	requirements: string[];
	deleteCommand: boolean;
}

/**
 * Interface for Command groups
 *
 * @class CommandModule
 * @prop {string} name The group that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 * @prop {string[]} permissions Array of all the different permissions needed
 */
class CommandModule {
	public name: string = "";
	public commands: Command[] = [];
	public permissions: string[] = [];

	constructor(name: string, permissions: string[], commandPath: string){
		this.name = name;
		this.permissions = permissions;

		fs.readdir(path.join(commandPath, "./"), (folderErr, files) => {
			for (const file of files){
				if (!(file === "index.ts")){
					const command: Command = require(path.join(commandPath, `/${file}`));
					this.commands.push(command);
				}
			}
		});
	}

	public checkPermissions(permissions: eris.Permission): boolean{
		for (const perm of this.permissions){
			if (!permissions.has(perm)){
				return false;
			}
		}
		return true;
	}

	public findCommand(name: string): undefined | Command {
		let command;
		for (const com of this.commands){
			if (com.commandName === name){
				command = com;
			}
		}
		return command;
	}
}

/**
 * Interface for object that stores the last times a user got experience in memory.
 *
 * @interface UserTimer
 * @prop {string} userid The user ID of a user
 * @prop {number} time The last time they got experience, should be 60 seconds between every time
 */
interface UserTimer {
	userid: string;
	time: number;
}

export {
	Command,
	CommandModule,
	UserTimer,
};
