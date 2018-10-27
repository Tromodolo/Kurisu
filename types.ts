import eris from "eris";
import fs from "fs";
import path from "path";

/**
 * Class definition for a command object
 *
 * @class Command
 * @prop {string} name The name of the command
 * @prop {string} description A short description of the command
 * @prop {string} fullDescription A more in depth description of the command
 * @prop {string} usage Basic usage instructions for the command
 * @prop {string[]} aliases Other names for the command
 * @prop {object} requirements List of requirements needed for the command
 * @prop {boolean} deleteCommand Flag used to determine whether to delete the under message
 * @prop {function} commandFunc Command function that runs when the command gets triggered
 */
class Command {
	public commandName: string = "";
	public description: string = "";
	public fullDescription: string = "";
	public usage: string = "";
	public aliases: string[] = [];
	public requirements: string[] = [];
	public deleteCommand: boolean = false;

	/**
	 * @param name The name of the command
	 * @param description A short description of the command
	 * @param fullDesc A more in depth description of the command
	 * @param usage Usage instructions for the command
	 * @param aliases Other names for the command
	 * @param requirements List of requirements needed for the command
	 * @param deleteCommand Flag used to determine whether to delete the under message
	 * @param func Command function that runs when the command gets triggered
	 */
	constructor(name: string, description: string, fullDesc: string, usage: string,
				aliases: string[], requirements: string[], deleteCommand: boolean,
				func: (message: eris.Message, args: string[]) => Promise<{}>){
		this.commandName = name;
		this.description = description;
		this.fullDescription = fullDesc;
		this.usage = usage;
		this.aliases = aliases;
		this.requirements = requirements;
		this.deleteCommand = deleteCommand;
		this.commandFunc = func;
	}

	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<{}>}
	 */
	public commandFunc: (message: eris.Message, args: string[]) => Promise<{}> = () => {
		return new Promise((resolve) => resolve());
	}

	public checkPermissions(permissions: eris.Permission): boolean {
		for (const perm of this.requirements){
			if (!permissions.has(perm)){
				return false;
			}
		}
		return true;
	}
}

/**
 * Class definition for Command Modules
 *
 * @class CommandModule
 * @prop {string} name The module that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 * @prop {string[]} permissions Array of all the different permissions needed
 */
class CommandModule {
	public name: string = "";
	public commands: Command[] = [];
	public permissions: string[] = [];

	/**
	 * @param name The module that the particular command belongs to
	 * @param permissions Array of all the commands within the command module
	 * @param commandPath Array of all the different permissions needed
	 */
	constructor(name: string, permissions: string[], commandPath: string){
		this.name = name;
		this.permissions = permissions;

		fs.readdir(path.join(commandPath, "./"), (folderErr, files) => {
			for (const file of files){
				if (!(file === "index.ts")){
					const command = require(path.join(commandPath, `/${file}`));
					this.commands.push(command.default);
				}
			}
		});
	}

	/**
	 * Checks whether or not the passed through permissions are allowed to run a command from a module
	 * @param permissions eris.js permissions object
	 * @returns {boolean}
	 */
	public checkPermissions(permissions: eris.Permission): boolean{
		for (const perm of this.permissions){
			if (!permissions.has(perm)){
				return false;
			}
		}
		return true;
	}

	/**
	 * Checks to see whether or not a command exists in a module. Returns undefined if not found
	 * @param name Name of command to find
	 * @returns {undefined | Command}
	 */
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
