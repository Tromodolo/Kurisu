import Axios from "axios";
import { Member, Message } from "eris";
import { bot } from "../../bot";
import * as config from "../../config.json";
import { getLoveUsers, getUserByMessage } from "../../util/Util";

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
const requirements: object = {};
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const users: { first?: Member, second?: Member } = getLoveUsers(message, args);
		if (!(users.first && users.second)){
			await bot.createMessage(message.channel.id, "You need to specify two people.");
		}
		else{
			const firstAvatar = users.first.avatarURL.replace(".jpg", ".png");
			const secondAVatar = users.second.avatarURL.replace(".jpg", ".png");

			Axios.post(`${config.apiEndpoint}/api/love`, {
				apiKey: config.kurisuApiKey,
				firstUser: {
					username: users.first.username,
					avatar: firstAvatar,
				},
				secondUser: {
					username: users.first.username,
					avatar: secondAVatar,
				},
			}, {
				responseType: "arraybuffer",
			},
			).then(async (result) => {
				const buffer = Buffer.from(result.data, "utf8");
				await bot.createMessage(message.channel.id, "", { file: buffer, name: "love.png"});
			});
		}
		return resolve();
	});
}

export {
	aliases,
	description,
	fullDescription,
	commandFunc,
	commandName,
	usage,
	requirements,
	deleteCommand,
};
