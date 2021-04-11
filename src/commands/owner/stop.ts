import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default new KurisuCommand (
	{
		name: "stop",
		description: "Stops the bot",
		usage: "stop",
		aliases: [
			"kill",
			"die",
		],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			message.channel.createMessage("Shutting down...");
			bot.client.disconnect({ reconnect: false });
			pm2.stop("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve(null);
		});
	},
);
