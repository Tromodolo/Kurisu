import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import Command from "../../models/Command";

export default class Restart extends Command {
	constructor(){
		super();
		this.commandName = "restart";
		this.aliases = [
			"reboot",
			"dmail",
		];
		this.description = "Restarts the bot";
		this.fullDescription = "Restarts the bot";
		this.usage = "restart";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			message.channel.createMessage("Restarting, will be back soon");
			bot.client.disconnect({ reconnect: false });
			pm2.restart("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve();
		});
	}
}