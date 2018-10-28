import { Message } from "eris";
import { Command } from "../../types";

const commandName: string = "test";
const aliases: string[] = [];
const description: string = "";
const fullDescription: string = "";
const usage: string = "";
// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		await message.channel.createMessage("Hi hello");
		resolve();
	});
}

const command = new Command(
	commandName,
	description,
	fullDescription,
	usage,
	aliases,
	requirements,
	deleteCommand,
	commandFunc,
);

export default command;
