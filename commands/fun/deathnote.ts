import Axios from "axios";
import { Message } from "eris";
import * as config from "../../config.json";
import { Command } from "../../types";

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

		Axios.post(`${config.apiEndpoint}api/images/deathnote`, {
			apiKey: config.kurisuApiKey,
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
