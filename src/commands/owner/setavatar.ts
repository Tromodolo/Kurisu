import axios from "axios";
import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";

const commandName: string = "setavatar";
const aliases: string[] = [
];
const description: string = "Sets the avatar of the bot";
const fullDescription: string = "Sets the avatar of the bot";
const usage: string = "setname [url]";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (args.length < 1){
			message.channel.createMessage("You need to specify a url");
		}
		else{
			axios.get(args[0], {
			  responseType: "arraybuffer",
			})
			.then((response) => {
				const buffer = Buffer.from(response.data, "utf8");
				const avatarBase = "data:image/png;base64," + buffer.toString("base64");
				bot.editSelf({ avatar: avatarBase });
			});
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
