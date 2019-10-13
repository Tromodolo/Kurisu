import { Message } from "eris";
import pm2 from "pm2";
import Command from "../../models/Command";
import { Bot } from "../../bot";

export default class Stop extends Command {
	constructor(){
		super();
		this.commandName = "stop";
		this.aliases = [
			"kill",
			"die",
		];
		this.description = "Stops the bot";
		this.fullDescription = "Stops the bot";
		this.usage = "stop";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			message.channel.createMessage("Shutting down...");
			bot.client.disconnect({ reconnect: false });
			pm2.stop("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve();
		});
	}
}