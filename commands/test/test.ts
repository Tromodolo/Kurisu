import { Message } from "eris";
import { bot } from "../../bot";

const commandName: string = "test";
const aliases: string[] = [];
const description: string = "";
const usage: string = "";

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		await bot.createMessage(message.channel.id, "Hi hello");
		resolve();
	});
}

export {
	aliases,
	description,
	commandFunc,
	commandName,
	usage,
};