import { Member, Message, PrivateChannel } from "eris";
import moment from "moment";
import { bot } from "../../bot";
import { Command } from "../../types";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { getHighestRole, getUserByMessage } from "../../util/Util";

const commandName: string = "prune";
const aliases: string[] = [
	"purge",
];
const description: string = "Prunes amount of messages specified, up to 100";
const fullDescription: string = "Prunes amount of messages specified, up to 100";
const usage: string = "prune {number}";

// const requirements: new Object();
const requirements: string[] = [
	"manageMessages",
];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		let messages = 0;
		if (!args[0]){
			messages = 10;
		}
		else{
			messages = parseInt(args[0]);
		}
		if (messages > 100){
			messages = 100;
		}
		if (messages === 0){
			return;
		}
		let messageIds: string[] = [];

		message.channel.getMessages(messages + 1).then((messageList) => {
			messageIds = messageList.map((msg) => msg.id);

			if 	(messageIds.length > 0){
				bot.deleteMessages(message.channel.id, messageIds, "Prune command").then(() => {
					message.channel.createMessage(`🗑 ${messages} messages deleted`);
				});
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
