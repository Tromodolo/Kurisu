import { Message } from "eris";

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
	name: string;
	description: string;
	fullDescription: string;
	/**
	 * @arg {Message} message The message sent
	 * @arg {String[]} args Array of all the args sent with the command
	 * @returns {Promise<{}>}
	 */
	function: (message: Message, args: string[]) => Promise<{}>;
	usage: string;
	aliases: string[];
	requirements: object;
	deleteCommand: boolean;
}

/**
 * Interface for Command groups
 *
 * @interface CommandModule
 * @prop {string} name The group that the particular command belongs to
 * @prop {Command[]} commands Array of all the commands within the command group
 */
interface CommandModule {
	name: string;
	commands: Command[];
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
