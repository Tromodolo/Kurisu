import { Message, TextChannel } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default new KurisuCommand (
	{
		name: "prune",
		description: "Prunes amount of messages specified, up to 100",
		usage: "prune {number}",
		aliases: [
			"purge",
		],
		requirements: ["manageMessages"],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if ((message.channel as TextChannel)?.guild === undefined){
				return;
			}

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

			try{
				const messageList = await message.channel.getMessages(messages + 1);
				messageIds = (messageList as Array<Message<TextChannel>>).map((msg) => msg.id);
				if 	(messageIds.length > 0){
					bot.client.deleteMessages(message.channel.id, messageIds, "Prune command").then(() => {
						message.channel.createMessage(`🗑 ${messages} messages deleted`);
					});
				}
			}
			catch (err) {
				return reject(err);
			}
			return resolve(null);
		});
	},
);
