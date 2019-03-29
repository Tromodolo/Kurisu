import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";
import { waitForResponse } from "../../util/Util";

const commandName: string = "custom";
const aliases: string[] = [];
const description: string = "Rolls a random number up to 100";
const fullDescription: string = "Rolls a random number up to 100 or a specified max.";
const usage: string = "roll [maxnumber]";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		waitForResponse(bot, message.author).then(async (returnedMessage: Message) => {
			console.log(returnedMessage);
			await message.channel.createMessage(`:game_die:${returnedMessage.content}`);
		});
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
