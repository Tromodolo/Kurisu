import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default class Restart extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "restart",
			description: "Restarts the bot",
			usage: "restart",
			aliases: [
				"reboot",
				"dmail",
			],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			message.channel.createMessage("Restarting, will be back soon");
			this.bot.client.disconnect({ reconnect: false });
			pm2.restart("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve();
		});
	}
}