import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";

const commandName: string = "setname";
const aliases: string[] = [
];
const description: string = "Sets the name of the bot";
const fullDescription: string = "Sets the name of the bot";
const usage: string = "setname Kurisu";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (args.length < 1){
			message.channel.createMessage("You need to specify a name");
		}
		else{
			bot.editSelf({username: args.join(" ")});
			message.channel.createMessage("Name changed! :ok_hand:");
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
