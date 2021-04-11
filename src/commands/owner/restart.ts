import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default new KurisuCommand (
	{
		name: "restart",
		description: "Restarts the bot",
		usage: "restart",
		aliases: [
			"reboot",
			"dmail",
		],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			message.channel.createMessage("Restarting, will be back soon");
			bot.client.disconnect({ reconnect: false });
			pm2.restart("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve(null);
		});
	},
);
