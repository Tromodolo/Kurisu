import { Message } from "eris";
import { Bot } from "../../bot";
import Command from "../../models/Command";

export default class Prune extends Command {
	constructor(){
		super();
		this.commandName = "prune";
		this.aliases = [
			"purge",
		];
		this.description = "Prunes amount of messages specified, up to 100";
		this.fullDescription = "Prunes amount of messages specified, up to 100";
		this.usage = "prune {number}";

		// const requirements: new Object();
		this.requirements = [
			"manageMessages",
		];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
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
					bot.client.deleteMessages(message.channel.id, messageIds, "Prune command").then(() => {
						message.channel.createMessage(`🗑 ${messages} messages deleted`);
					});
				}
			});
			return resolve();
		});
	}
}
