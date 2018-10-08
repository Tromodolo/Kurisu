import { Message } from "eris";

interface Command {
	name: string;
	description: string;
	fullDescription: string;
	function: (message: Message, args: string[]) => Promise<{}>;
	usage: string;
	aliases: string[];
	requirements: object;
	deleteCommand: boolean;
}

interface CommandModule {
	name: string;
	commands: Command[];
}

interface UserTimer {
	userid: string;
	time: number;
}

export {
	Command,
	CommandModule,
	UserTimer,
};
