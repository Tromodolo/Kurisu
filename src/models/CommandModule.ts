import eris from "eris";
import KurisuCommand from "./Command";

/**
 * Class definition for Command Modules
 *
 * @class CommandModule
 * @prop {string} name The module that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 * @prop {string[]} permissions Array of all the different permissions needed
 */
export default class KurisuModule {
	public name: string = "";
	public commands: KurisuCommand[] = [];
	public permissions: string[] = [];

	/**
	 * @param name The module that the particular command belongs to
	 * @param permissions Array of all the commands within the command module
	 * @param commands Array of all the commands
	 */
	constructor(name: string, permissions: string[], commands: KurisuCommand[]){
		this.name = name;
		this.permissions = permissions;
		this.commands = commands;
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
	 * @returns {undefined | KurisuCommand}
	 */
	public findCommand(name: string): undefined | KurisuCommand {
		let command;
		for (const com of this.commands){
			if (com.metadata.name === name || com.metadata.aliases.includes(name)){
				command = com;
			}
		}
		return command;
	}
}