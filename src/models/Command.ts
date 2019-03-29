import eris from "eris";

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
export default class Command {
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
	/* constructor(name: string, description: string, fullDesc: string, usage: string,
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
	} */

	constructor() {
		return;
	}

	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<{}>}
	 */
	public commandFunc(message: eris.Message, args: string[]){
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