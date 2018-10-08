import { Message } from "eris";
import { bot } from "../../bot";

const commandName: string = "test";
const aliases: string[] = [];
const description: string = "";
const fullDescription: string "";
const usage: string = "";
//const requirements: new Object();
const requirements: null;
const deleteCommand: false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		await bot.createMessage(message.channel.id, "Hi hello");
		resolve();
	});
}

export {
	aliases,
	description,
	fullDescription,
	commandFunc,
	commandName,
	usage,
	requirements,
	deleteCommand,
};
