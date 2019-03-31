import eris from "eris";
import fs from "fs";
import path from "path";
import Command from "./Command";

/**
 * Class definition for Command Modules
 *
 * @class CommandModule
 * @prop {string} name The module that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 * @prop {string[]} permissions Array of all the different permissions needed
 */
export default class CommandModule {
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
					try{
						this.commands.push(new command.default());
					}
					catch (e){
						continue;
					}
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