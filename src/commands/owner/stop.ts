import { Message } from "eris";
import pm2 from "pm2";
import { bot } from "../../bot";
import Command from "../../models/Command";

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

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			message.channel.createMessage("Shutting down...");
			bot.disconnect({ reconnect: false });
			pm2.stop("Kurisu", (err) => {
				if (err){
					return;
				}
			});
			return resolve();
		});
	}
}