import { Message } from "eris";
import pm2 from "pm2";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

import childProcess from "child_process";

export default class Update extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "update",
			description: "Downloads the most recent commit from git and updates",
			usage: "update",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			const newMessage = await message.channel.createMessage("Getting most recent git commit");
			childProcess.execSync("git pull");
			await newMessage.edit("Successfully got commit, compiling typescript");
			childProcess.execSync("tsc");
			await newMessage.edit("Successfully compiled, restarting...");
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