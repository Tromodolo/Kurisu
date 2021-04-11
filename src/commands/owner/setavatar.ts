import axios from "axios";
import { Message } from "eris";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";

export default new KurisuCommand (
	{
		name: "setavatar",
		description: "Sets the avatar of the bot",
		usage: "setavatar {url}",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject("You need to specify a url");
			}
			else{
				axios.get(args[0], {
					responseType: "arraybuffer",
				})
				.then((response) => {
					const buffer = Buffer.from(response.data, "utf8");
					const avatarBase = "data:image/png;base64," + buffer.toString("base64");
					bot.client.editSelf({ avatar: avatarBase });
				});
			}
			return resolve(null);
		});
	},
);
