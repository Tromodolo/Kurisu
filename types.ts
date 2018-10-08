import { Message } from "eris";

interface Command {
	name: string;
	description: string;
	fullDescription: string;
	function: (message: Message, args: string[]) => Promise<{}>;
	usage: string;
	aliases: string[];
	requirements: Object;
	deleteCommand: boolean;
}

interface CommandModule {
	name: string;
	commands: Command[];
}

export {
	Command,
	CommandModule,
};
