import { Message } from "eris";

interface Command {
	name: string;
	description: string;
	function: (message: Message, args: string[]) => Promise<{}>;
	usage: string;
	aliases: string[];
}

interface CommandModule {
	name: string;
	commands: Command[];
}

export {
	Command,
	CommandModule,
};