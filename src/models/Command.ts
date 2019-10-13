import eris from "eris";
import { Bot } from "../bot";

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

	constructor(){
		return;
	}

	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<*>}
	 */
	public exec(message: eris.Message, args: string[], bot?: Bot): Promise<any>{
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