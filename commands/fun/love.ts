import Axios from "axios";
import { Member, Message } from "eris";
import { generalConfig } from "../../config/";
import { Command } from "../../types";
import { getLoveUsers } from "../../util/Util";
import { botSettings } from "../../bot";

const commandName: string = "love";
const aliases: string[] = [
	"ship",
	"love",
	"match",
];
const description: string = "Love tests for two people";
const fullDescription: string = "Love tests two people and generates image";
const usage: string = "love {First-Person} {Second-Person}";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const users: { first?: Member, second?: Member } = getLoveUsers(message, args);
		if (!(users.first && users.second)){
			await message.channel.createMessage("You need to specify two people.");
		}
		else{
			const firstAvatar = users.first.avatarURL.replace(".jpg", ".png");
			const secondAvatar = users.second.avatarURL.replace(".jpg", ".png");

			Axios.post(`${generalConfig.apiEndpoint}api/images/love`, {
				apiKey: botSettings.kurisuApiKey,
				firstUser: {
					username: users.first.username,
					avatar: firstAvatar,
				},
				secondUser: {
					username: users.second.username,
					avatar: secondAvatar,
				},
			}, {
				responseType: "arraybuffer",
			},
			).then(async (result) => {
				const buffer = Buffer.from(result.data, "utf8");
				await message.channel.createMessage("", { file: buffer, name: "love.png"});
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
