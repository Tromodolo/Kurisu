import { Message } from "eris";
import pm2 from "pm2";
import { Command } from "../../types";

const commandName: string = "restart";
const aliases: string[] = [
	"reboot",
	"dmail",
];
const description: string = "Restarts the bot";
const fullDescription: string = "Restarts the bot";
const usage: string = "restart";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		message.channel.createMessage("Restarting, will be back soon");
		pm2.restart("Kurisu", (err) => {
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
