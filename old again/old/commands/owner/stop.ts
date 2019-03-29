import { Message } from "eris";
import pm2 from "pm2";
import { bot } from "../../bot";
import { Command } from "../../types";

const commandName: string = "stop";
const aliases: string[] = [
	"kill",
	"die",
];
const description: string = "Stops the bot";
const fullDescription: string = "Stops the bot";
const usage: string = "stop";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		message.channel.createMessage("Shutting down...");
		bot.disconnect({ reconnect: false });
		pm2.stop("Kurisu", (err) => {
			if (err){
				return;
			}
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
