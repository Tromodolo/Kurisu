import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default class Stop extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "stop",
			description: "Stops the bot",
			usage: "stop",
			aliases: [
				"kill",
				"die",
			],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			message.channel.createMessage("Shutting down...");
			this.bot.client.disconnect({ reconnect: false });
			pm2.stop("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve();
		});
	}
}