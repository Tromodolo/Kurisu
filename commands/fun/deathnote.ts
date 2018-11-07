import Axios from "axios";
import { Message } from "eris";
import { generalConfig } from "../../config/";
import { Command } from "../../types";
import { botSettings } from "../../bot";

const commandName: string = "deathnote";
const aliases: string[] = [
	"kirby",
];
const description: string = "Puts someone's name into the death note";
const fullDescription: string = "Puts someone's name into the death note";
const usage: string = "deathnote {person}";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		let text = "";
		if (args.length < 1){
			text = `${message.author.username}#${message.author.discriminator}`;
		}
		else{
			text = args.join(" ");
		}
		if (message.mentions.length > 0){
			for (const user of message.mentions){
				text = text.replace(/<@!?[0-9]*>/, user.username);
			}
		}

		Axios.post(`${generalConfig.apiEndpoint}api/images/deathnote`, {
			apiKey: botSettings.kurisuApiKey,
			text,
		}, {
			responseType: "arraybuffer",
		},
		).then(async (result) => {
			const buffer = Buffer.from(result.data, "utf8");
			await message.channel.createMessage("", { file: buffer, name: "deathnote.png"});
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
