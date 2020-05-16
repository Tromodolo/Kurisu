import eris from "eris";
import { Bot } from "../bot";

type CommandMetadata = {
	name: string;
	description: string;
	usage: string;
	aliases: string[];
	requirements: string[];
	delete: boolean;
};

/**
 * Class definition for a command object
 *
 * @class Command
 * @prop {CommandMetadata} metadata Command Metadata
 * @prop {Bot} bot Bot client instance
 * @prop {function} run Command function that runs when the command gets triggered
 */
export default class KurisuCommand {
	public metadata: CommandMetadata;
	public bot: Bot;

	constructor(bot: Bot, metadata: CommandMetadata){
		this.bot = bot;

		this.metadata = metadata;
	}

	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<*>}
	 */
	public execute(message: eris.Message, args: string[]): Promise<any>{
		return new Promise((resolve) => resolve());
	}

	public checkPermissions(permissions: eris.Permission): boolean {
		for (const perm of this.metadata.requirements){
			if (!permissions.has(perm)){
				return false;
			}
		}
		return true;
	}
}