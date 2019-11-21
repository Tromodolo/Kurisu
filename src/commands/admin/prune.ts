import { Message } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default class Prune extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "prune",
			description: "Prunes amount of messages specified, up to 100",
			usage: "prune {number}",
			aliases: [
				"purge",
			],
			requirements: ["manageMessages"],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
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
					this.bot.client.deleteMessages(message.channel.id, messageIds, "Prune command").then(() => {
						message.channel.createMessage(`🗑 ${messages} messages deleted`);
					});
				}
			}).catch((err) => reject(err));
			return resolve();
		});
	}
}
