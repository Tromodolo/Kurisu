import eris, { Message } from "eris";
import { bot, Bot } from "../bot";

type CommandMetadata = {
	name: string;
	description: string;
	usage: string;
	aliases: string[];
	requirements: Array<keyof eris.Constants["Permissions"]>;
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
	public callback: (message: Message, args: string[], bot: Bot) => Promise<any>;

	constructor(metadata: CommandMetadata, callback: (message: Message, args: string[], bot: Bot) => Promise<any>) {
		this.metadata = metadata;
		this.callback = callback;
	}

	/**
	 * @arg {Message} message The message sent
	 * @arg {string[]} args Array of all the args sent with the command
	 * @returns {Promise<*>}
	 */
	public async execute(message: eris.Message, args: string[]) {
		await this.callback(message, args, bot);
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