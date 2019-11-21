import { Message } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default class SetName extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "setname",
			description: "Sets the name of the bot",
			usage: "setname {name}",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject("You need to specify a name");
			}
			else{
				this.bot.client.editSelf({username: args.join(" ")});
				message.channel.createMessage("Name changed! :ok_hand:");
			}
			return resolve();
		});
	}
}