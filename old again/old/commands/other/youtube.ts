import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";
import { youtubeLookup } from "../../util/Util";

const commandName: string = "youtube";
const aliases: string[] = [];
const description: string = "Looks something up on youtube";
const fullDescription: string = "Looks something up on youtube";
const usage: string = "youtube {term}";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (args.length < 1){
			message.channel.createMessage("You need to specify a search term");
		}
		else{
			youtubeLookup(bot, message, args.join(" "), false);
		}
		return resolve();
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
