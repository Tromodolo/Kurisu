import { Message } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default new KurisuCommand (
	{
		name: "setname",
		description: "Sets the name of the bot",
		usage: "setname {name}",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject("You need to specify a name");
			}
			else{
				bot.client.editSelf({username: args.join(" ")});
				message.channel.createMessage("Name changed! :ok_hand:");
			}
			return resolve(null);
		});
	},
);
